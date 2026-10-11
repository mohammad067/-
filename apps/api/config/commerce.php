<?php

return [
    'auth' => [
        'token_ttl_days' => (int) env('API_TOKEN_TTL_DAYS', 30),
    ],
    'cart' => [
        'expires_after_days' => (int) env('CART_EXPIRES_AFTER_DAYS', 30),
        'abandon_after_hours' => (int) env('CART_ABANDON_AFTER_HOURS', 24),
    ],

    'checkout' => [
        'payment_window_minutes' => (int) env('ORDER_PAYMENT_WINDOW_MINUTES', 20),
        'shipping_methods' => [
            'standard' => [
                'name' => 'ارسال استاندارد',
                'price_rials' => (int) env('STANDARD_SHIPPING_PRICE_RIALS', 500_000),
            ],
            'tipax' => [
                'name' => 'تیپاکس',
                'price_rials' => (int) env('TIPAX_SHIPPING_PRICE_RIALS', 700_000),
            ],
            'vip' => [
                'name' => 'پیک اختصاصی',
                'price_rials' => (int) env('VIP_SHIPPING_PRICE_RIALS', 1_200_000),
            ],
        ],
    ],
];
