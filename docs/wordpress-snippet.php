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
 * 6) (İsteğe bağlı) Ürün değişince yeni sitenin önbelleğini anında yenile.
 *    WooCommerce → Ayarlar → Gelişmiş → Webhooks ile de yapılabilir; ikisinden
 *    birini kullanın. REVALIDATE_SECRET, Hostinger'daki ortam değişkeniyle aynı olmalı.
 */
// add_action( 'woocommerce_update_product', function () {
// 	wp_remote_post( FLORES_STOREFRONT . '/api/revalidate?secret=' . rawurlencode( 'REVALIDATE_SECRET_DEGERI' ), array( 'blocking' => false ) );
// } );
