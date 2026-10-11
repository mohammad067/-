<?php

namespace App\Http\Requests\Api\V1;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class PlaceGuestOrderRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /** @return array<string, mixed> */
    public function rules(): array
    {
        return [
            '_idempotency_key' => ['required', 'string', 'min:32', 'max:255'],
            'cartId' => ['required', 'string', 'ulid'],
            'customer' => ['required', 'array:name,phone,email'],
            'customer.name' => ['required', 'string', 'max:255'],
            'customer.phone' => ['required', 'string', 'regex:/^\+989\d{9}$/'],
            'customer.email' => ['nullable', 'email:rfc', 'max:255'],
            'shippingAddress' => ['required', 'array:province,city,postalCode,addressLine'],
            'shippingAddress.province' => ['required', 'string', 'max:100'],
            'shippingAddress.city' => ['required', 'string', 'max:100'],
            'shippingAddress.postalCode' => ['nullable', 'string', 'regex:/^\d{10}$/'],
            'shippingAddress.addressLine' => ['required', 'string', 'max:1000'],
            'shippingMethod' => [
                'required',
                'string',
                Rule::in(array_keys(config('commerce.checkout.shipping_methods'))),
            ],
            'customerNote' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /** @return array<string, string> */
    public function messages(): array
    {
        return [
            '_idempotency_key.required' => 'هدر X-Idempotency-Key الزامی است.',
            'cartId.required' => 'شناسه سبد خرید الزامی است.',
            'customer.name.required' => 'نام تحویل‌گیرنده الزامی است.',
            'customer.phone.regex' => 'شماره موبایل معتبر ایرانی وارد کنید.',
            'shippingAddress.addressLine.required' => 'نشانی تحویل الزامی است.',
        ];
    }

    protected function prepareForValidation(): void
    {
        $phone = data_get($this->all(), 'customer.phone');
        $postalCode = data_get($this->all(), 'shippingAddress.postalCode');

        $this->merge([
            '_idempotency_key' => $this->header('X-Idempotency-Key'),
            'customer' => array_replace((array) $this->input('customer', []), [
                'phone' => $this->normalizeIranianMobile(is_string($phone) ? $phone : null),
            ]),
            'shippingAddress' => array_replace((array) $this->input('shippingAddress', []), [
                'postalCode' => is_string($postalCode) ? $this->translateDigits($postalCode) : $postalCode,
            ]),
        ]);
    }

    private function normalizeIranianMobile(?string $phone): ?string
    {
        if ($phone === null) {
            return null;
        }

        $digits = preg_replace('/\D+/', '', $this->translateDigits($phone));

        if ($digits === null) {
            return $phone;
        }

        if (str_starts_with($digits, '0098')) {
            $digits = substr($digits, 4);
        } elseif (str_starts_with($digits, '98')) {
            $digits = substr($digits, 2);
        } elseif (str_starts_with($digits, '0')) {
            $digits = substr($digits, 1);
        }

        return preg_match('/^9\d{9}$/', $digits) === 1 ? "+98{$digits}" : $phone;
    }

    private function translateDigits(string $value): string
    {
        return strtr($value, [
            '۰' => '0', '۱' => '1', '۲' => '2', '۳' => '3', '۴' => '4',
            '۵' => '5', '۶' => '6', '۷' => '7', '۸' => '8', '۹' => '9',
            '٠' => '0', '١' => '1', '٢' => '2', '٣' => '3', '٤' => '4',
            '٥' => '5', '٦' => '6', '٧' => '7', '٨' => '8', '٩' => '9',
        ]);
    }
}
