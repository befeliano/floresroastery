<?php
/**
 * Flores Roastery — Headless köprü snippet'i
 * ------------------------------------------
 * WordPress → Snippets (Code Snippets eklentisi) → Yeni Ekle → bu kodu yapıştırın,
 * "Run everywhere" seçip etkinleştirin.
 *
 * Yalnızca yeni Next.js sitesinden açılan siparişleri etkiler (`_flores_headless`
 * meta'sı). WordPress'teki B2B konfigüratörü ve diğer siparişler aynen çalışır.
 */

// Yeni sitenin adresi (Next.js uygulaması)
const FLORES_STOREFRONT = 'https://floresroastery.com';

// Hostinger'daki REVALIDATE_SECRET ortam değişkeniyle AYNI değer (ürün kaydedince site anında güncellenir)
const FLORES_REVALIDATE_SECRET = 'BURAYA_REVALIDATE_SECRET';

/**
 * 1) iyzico ödemesi bittikten sonra müşteriyi WooCommerce "teşekkürler" sayfası
 *    yerine yeni sitenin sipariş onay sayfasına gönder.
 */
add_filter( 'woocommerce_get_checkout_order_received_url', function ( $url, $order ) {
	if ( $order instanceof WC_Order && $order->get_meta( '_flores_headless' ) ) {
		return add_query_arg( array( 'no' => $order->get_order_number() ), FLORES_STOREFRONT . '/siparis/tamamlandi' );
	}
	return $url;
}, 20, 2 );

/**
 * 2) Ödeme iptal edilir / başarısız olursa müşteri sepet yerine yeni siteye dönsün.
 */
add_filter( 'woocommerce_get_cancel_order_url_raw', function ( $url ) {
	$order_id = absint( $_GET['order_id'] ?? 0 );
	$order    = $order_id ? wc_get_order( $order_id ) : null;
	if ( $order && $order->get_meta( '_flores_headless' ) ) {
		return FLORES_STOREFRONT . '/odeme';
	}
	return $url;
} );

/**
 * 3) Yeni siteden gelen kartlı siparişin ödeme sayfasında yalnızca iyzico seçenekleri
 *    görünsün (müşteri sitede "Kart" seçti; Kapıda ödeme / Havale burada çıkmasın).
 */
add_filter( 'woocommerce_available_payment_gateways', function ( $gateways ) {
	if ( is_admin() || ! function_exists( 'is_wc_endpoint_url' ) || ! is_wc_endpoint_url( 'order-pay' ) ) {
		return $gateways;
	}
	$order = wc_get_order( absint( get_query_var( 'order-pay' ) ) );
	if ( $order && $order->get_meta( '_flores_headless' ) ) {
		$card = array_intersect_key( $gateways, array_flip( array( 'iyzico', 'pwi' ) ) );
		if ( $card ) {
			return $card;
		}
	}
	return $gateways;
} );

/**
 * 4) Üye girişi köprüsü — yeni sitedeki "Giriş yap" mevcut WordPress hesaplarıyla çalışsın.
 *    "wc-" önekli uç noktalar WooCommerce anahtarıyla (ck/cs) korunur: yalnızca yeni sitenin
 *    sunucusu çağırabilir. Şifreler WordPress'te kalır, yeni siteye hiç kaydedilmez.
 */
add_action( 'rest_api_init', function () {
	$only_store = function () {
		return current_user_can( 'manage_woocommerce' );
	};

	// e-posta / kullanıcı adı + şifre doğrulaması
	register_rest_route( 'wc-flores/v1', '/login', array(
		'methods'             => 'POST',
		'permission_callback' => $only_store,
		'callback'            => function ( WP_REST_Request $req ) {
			$login = sanitize_text_field( (string) $req->get_param( 'login' ) );
			$pass  = (string) $req->get_param( 'password' );
			$user  = is_email( $login ) ? get_user_by( 'email', $login ) : get_user_by( 'login', $login );
			if ( ! $user || '' === $pass || ! wp_check_password( $pass, $user->user_pass, $user->ID ) ) {
				return new WP_Error( 'flores_invalid_login', 'invalid', array( 'status' => 401 ) );
			}
			return array( 'id' => $user->ID, 'email' => $user->user_email );
		},
	) );

	// şifre sıfırlama: WooCommerce'in "Şifre sıfırlama" e-postası gönderilir
	register_rest_route( 'wc-flores/v1', '/lost-password', array(
		'methods'             => 'POST',
		'permission_callback' => $only_store,
		'callback'            => function ( WP_REST_Request $req ) {
			$login = sanitize_text_field( (string) $req->get_param( 'login' ) );
			$user  = is_email( $login ) ? get_user_by( 'email', $login ) : get_user_by( 'login', $login );
			if ( $user ) {
				$key = get_password_reset_key( $user );
				if ( ! is_wp_error( $key ) ) {
					WC()->mailer();
					do_action( 'woocommerce_reset_password_notification', $user->user_login, $key );
				}
			}
			return array( 'ok' => true ); // hesap var/yok bilgisi verilmez
		},
	) );
} );

/**
 * 5) Üye kartla ödediyse sipariş, ödeme alınınca hesabına bağlansın
 *    (ödenmemiş siparişi hesaba bağlamak WordPress ödeme sayfasında giriş ister).
 */
add_action( 'woocommerce_order_status_changed', function ( $order_id, $from, $to, $order ) {
	if ( ! in_array( $to, array( 'processing', 'completed', 'on-hold' ), true ) || $order->get_customer_id() ) {
		return;
	}
	$customer_id = absint( $order->get_meta( '_flores_customer_id' ) );
	if ( $customer_id && get_userdata( $customer_id ) ) {
		$order->set_customer_id( $customer_id );
		$order->save();
	}
}, 10, 4 );

/**
 * 6) Ürün kaydedilince yeni site ANINDA güncellensin (ad, fiyat, indirim, stok, yeni ürün).
 *    Bağır'ın ek bir şey yapmasına gerek yok: WordPress'te ürünü kaydetmesi yeterli.
 */
function flores_ping_storefront( $tag = 'products' ) {
	if ( ! FLORES_REVALIDATE_SECRET || 'BURAYA_REVALIDATE_SECRET' === FLORES_REVALIDATE_SECRET ) {
		return;
	}
	wp_remote_post(
		FLORES_STOREFRONT . '/api/revalidate?tag=' . rawurlencode( $tag ) . '&secret=' . rawurlencode( FLORES_REVALIDATE_SECRET ),
		array( 'blocking' => false, 'timeout' => 3 )
	);
}
add_action( 'woocommerce_update_product', function () { flores_ping_storefront(); } );
add_action( 'woocommerce_new_product', function () { flores_ping_storefront(); } );
add_action( 'woocommerce_product_set_stock_status', function () { flores_ping_storefront(); } );
add_action( 'woocommerce_variation_set_stock_status', function () { flores_ping_storefront(); } );
add_action( 'woocommerce_update_product_variation', function () { flores_ping_storefront(); } );
add_action( 'trashed_post', function ( $id ) {
	if ( 'product' === get_post_type( $id ) ) {
		flores_ping_storefront();
	}
} );

/**
 * 7) "Flores Ayarları" — WordPress menüsünde basit bir sayfa: fincan maliyeti hesabındaki
 *    gramajlar ve süt fiyatı. Kaydedince site anında günceller. (Varsayılanlar parantez içinde.)
 */
function flores_settings_fields() {
	return array(
		'filterGrams'         => array( 'Filtre kahve (V60) — gram', 15 ),
		'espressoSingleGrams' => array( 'Espresso / Americano tek shot — gram', 9 ),
		'espressoDoubleGrams' => array( 'Espresso / Americano çift shot — gram', 18 ),
		'latteGrams'          => array( 'Latte — çekirdek gram', 18 ),
		'latteMilkMl'         => array( 'Latte — süt (ml)', 240 ),
		'milkPricePerLiter'   => array( 'Süt litre fiyatı (₺)', 55 ),
	);
}

add_action( 'admin_menu', function () {
	add_menu_page( 'Flores Ayarları', 'Flores Ayarları', 'manage_woocommerce', 'flores-ayarlari', function () {
		$values = get_option( 'flores_settings', array() );
		if ( isset( $_POST['flores_settings_nonce'] ) && wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['flores_settings_nonce'] ) ), 'flores_settings' ) ) {
			foreach ( flores_settings_fields() as $key => $field ) {
				$v = isset( $_POST[ $key ] ) ? floatval( str_replace( ',', '.', wp_unslash( $_POST[ $key ] ) ) ) : $field[1];
				$values[ $key ] = $v > 0 ? $v : $field[1];
			}
			update_option( 'flores_settings', $values );
			flores_ping_storefront( 'settings' );
			echo '<div class="notice notice-success"><p>Kaydedildi — site birkaç saniye içinde güncellenir.</p></div>';
		}
		echo '<div class="wrap"><h1>Flores Ayarları</h1><p>Ürün sayfalarındaki “Fincanı kaça geliyor?” hesabı bu değerlerle yapılır.</p><form method="post"><table class="form-table">';
		foreach ( flores_settings_fields() as $key => $field ) {
			$v = isset( $values[ $key ] ) ? $values[ $key ] : $field[1];
			printf( '<tr><th><label for="%1$s">%2$s</label></th><td><input id="%1$s" name="%1$s" type="number" step="0.01" min="0.01" value="%3$s" /> <span class="description">(varsayılan %4$s)</span></td></tr>', esc_attr( $key ), esc_html( $field[0] ), esc_attr( $v ), esc_html( $field[1] ) );
		}
		wp_nonce_field( 'flores_settings', 'flores_settings_nonce' );
		echo '</table>';
		submit_button( 'Kaydet' );
		echo '</form></div>';
	}, 'dashicons-coffee', 56 );
} );

// Site bu değerleri buradan okur (yalnızca sayılar; kişisel veri yok)
add_action( 'rest_api_init', function () {
	register_rest_route( 'wc-flores/v1', '/settings', array(
		'methods'             => 'GET',
		'permission_callback' => '__return_true',
		'callback'            => function () {
			$values = get_option( 'flores_settings', array() );
			$out    = array();
			foreach ( flores_settings_fields() as $key => $field ) {
				$out[ $key ] = isset( $values[ $key ] ) ? (float) $values[ $key ] : $field[1];
			}
			return $out;
		},
	) );
} );
