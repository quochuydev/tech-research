# AccessTrade.vn — API Research

## 1. Developer Account Setup

| Step | Action                                                                                            |
| ---- | ------------------------------------------------------------------------------------------------- |
| 1    | Go to `https://accesstrade.vn` and click "Đăng ký" (Register)                                     |
| 2    | Register as a **Publisher** at `https://workspace.accesstrade.vn/authentication/register?lang=vi` |
| 3    | Fill in your website/channel information and submit for review                                    |
| 4    | Once approved, access your dashboard at `https://pub2.accesstrade.vn`                             |

**Approval time:** Manual review — typically 1–3 business days.

## 2. API Key / Authentication

| Item              | Detail                                                                                                               |
| ----------------- | -------------------------------------------------------------------------------------------------------------------- |
| **Auth type**     | API Token                                                                                                            |
| **Where to find** | Dashboard → `https://pub.accesstrade.vn/publisher_profile/personal_info?position=info` (or Tools → API → Access Key) |
| **Header format** | `Authorization: Token <YOUR_ACCESS_KEY>`                                                                             |
| **Content-Type**  | `application/json`                                                                                                   |
| **Rate limits**   | Varies per endpoint (e.g., transactions: 10 req/min, offers: 30 req/min)                                             |

> **Note:** The global AccessTrade platform (`accesstrade.global`) uses JWT/Bearer tokens instead. The Vietnam platform (`accesstrade.vn`) uses the simpler `Token` scheme shown above.

## 3. API Examples

**Base URL:** `https://api.accesstrade.vn`

---

### Get Campaigns List — list available campaigns

**curl**

```bash
curl -X GET 'https://api.accesstrade.vn/v1/campaigns?limit=20&page=1&approval=successful' \
  -H 'Authorization: Token <YOUR_ACCESS_KEY>' \
  -H 'Content-Type: application/json'
```

**Parameters**

| Parameter     | Required | Description                                   |
| ------------- | -------- | --------------------------------------------- |
| `approval`    | No       | Filter: `"successful"` for approved campaigns |
| `campaign_id` | No       | Filter by specific campaign ID                |
| `limit`       | No       | Results per page                              |
| `page`        | No       | Page number                                   |

**Sample Response**

```json
{
  "data": [
    {
      "id": "5585194803623188142",
      "name": "Citibank New",
      "approval": "successful",
      "status": 1,
      "merchant": "citibank_new",
      "url": "https://www.citibank.com.vn/vietnamese/form/uu-dai-mo-the-tin-dung/index.htm",
      "logo": "https://static.accesstrade.vn/adv/img/1612752152_Citi-Logo.png",
      "start_time": "2021-02-05T14:25:04.542000",
      "end_time": null,
      "description": {
        "action_point": "...",
        "commission_policy": "315,000 VNĐ per lead",
        "introduction": "...",
        "other_notice": "...",
        "rejected_reason": "...",
        "traffic_building_policy": "..."
      },
      "category": "",
      "sub_category": "",
      "type": -1,
      "cookie_duration": 0,
      "cookie_policy": "Cookie retention 30 days",
      "scope": "private"
    }
  ],
  "total": 1
}
```

---

### Top Selling Products — get best-performing products

**curl**

```bash
curl -X GET 'https://api.accesstrade.vn/v1/top_products?date_from=01-01-2025&date_to=30-03-2025&merchant=lazada' \
  -H 'Authorization: Token <YOUR_ACCESS_KEY>' \
  -H 'Content-Type: application/json'
```

**Parameters**

| Parameter   | Required | Description                                        |
| ----------- | -------- | -------------------------------------------------- |
| `date_from` | No       | Start date, format: `DD-MM-YYYY`                   |
| `date_to`   | No       | End date, format: `DD-MM-YYYY`                     |
| `merchant`  | No       | Filter by merchant name (e.g., `lazada`, `shopee`) |

**Sample Response**

```json
{
  "data": [
    {
      "product_id": "B076WVGLXS",
      "name": "Razor Turbo Jetts Electric Heel Wheels - Red",
      "price": 2869795.0,
      "discount": 2869795.0,
      "image": "https://images-na.ssl-images-amazon.com/images/I/81259FdCzzL.jpg",
      "link": "https://fado.vn/us/amazon/razor-turbo-jetts-B076WVGLXS.html",
      "aff_link": "https://go.isclix.com/deep_link/4348611760548105593?url=...",
      "brand": "",
      "category_name": "Sports & Outdoors",
      "category_id": "",
      "product_category": "FADOTREN2000000",
      "desc": null,
      "short_desc": null
    }
  ],
  "total": 1
}
```

---

### Get Datafeeds — browse/search product catalogs

This is the best endpoint for getting product listings. Unlike `top_products` (which may return empty), datafeeds gives you the full product catalog for a merchant.

**curl**

```bash
curl -X GET 'https://api.accesstrade.vn/v1/datafeeds?domain=lazada.vn&limit=50&page=1' \
  -H 'Authorization: Token <YOUR_ACCESS_KEY>' \
  -H 'Content-Type: application/json'
```

**Parameters**

| Parameter              | Required | Description                                      |
| ---------------------- | -------- | ------------------------------------------------ |
| `campaign`             | No       | Merchant/campaign name (e.g., `lazadaapp`)       |
| `domain`               | No       | Merchant domain (e.g., `lazada.vn`, `shopee.vn`) |
| `price_from`           | No       | Min original price                               |
| `price_to`             | No       | Max original price                               |
| `discount_from`        | No       | Min discounted price                             |
| `discount_to`          | No       | Max discounted price                             |
| `discount_amount_from` | No       | Min discount amount                              |
| `discount_amount_to`   | No       | Max discount amount                              |
| `discount_rate_from`   | No       | Min discount percentage                          |
| `discount_rate_to`     | No       | Max discount percentage                          |
| `status_discount`      | No       | `1` = has active discount, `0` = no discount     |
| `update_from`          | No       | Filter by update date start (`DD-MM-YYYY`)       |
| `update_to`            | No       | Filter by update date end (`DD-MM-YYYY`)         |
| `limit`                | No       | Results per page (default 50, max 200)           |
| `page`                 | No       | Page number (default 1)                          |

**Sample Response**

```json
{
  "data": [
    {
      "product_id": "224_AN273FAAA1FXLXVNAMZ-2293380",
      "sku": "AN273FAAA1FXLXVNAMZ-2293380",
      "name": "Áo Thun Cao Cấp Hình Star Wars Coffee - MITADI – ASTE072",
      "price": 175000.0,
      "discount": 175000.0,
      "discount_amount": 0.0,
      "discount_rate": 0.0,
      "status_discount": 0,
      "image": "https://vn-live-01.slatic.net/p/7/...",
      "url": "https://www.lazada.vn/ao-thun-cao-cap-hinh-star-wars-coffee-2423013.html",
      "aff_link": "https://go.isclix.com/deep_link/...",
      "campaign": "lazadaapp",
      "merchant": "lazadaapp",
      "domain": "lazada.vn",
      "cate": "thoi-trang-my-pham",
      "desc": null,
      "promotion": null,
      "update_time": "24-07-2018T01:02:19"
    }
  ],
  "total": 1
}
```

> **Note:** The `aff_link` in datafeeds is already an affiliate link — you can use it directly without calling the Create Tracking Link endpoint. Use Create Tracking Link only when you have raw product URLs that need conversion.

---

### Get Promotional Information — vouchers, coupons, deals

**curl**

```bash
curl -X GET 'https://api.accesstrade.vn/v1/offers_informations?merchant=shopee&coupon=1&status=1&limit=50&page=1' \
  -H 'Authorization: Token <YOUR_ACCESS_KEY>' \
  -H 'Content-Type: application/json'
```

**Parameters**

| Parameter    | Required | Description                                           |
| ------------ | -------- | ----------------------------------------------------- |
| `scope`      | No       | `"expiring"` to get near-expiry offers                |
| `merchant`   | No       | Merchant name (e.g., `shopee`, `lazada`)              |
| `categories` | No       | Comma-separated categories (e.g., `voucher-services`) |
| `domain`     | No       | Merchant domain (e.g., `lazada.vn`)                   |
| `coupon`     | No       | `1` = has coupon code, `0` = no coupon                |
| `status`     | No       | `1` = active, `0` = expired                           |
| `limit`      | No       | Results per page                                      |
| `page`       | No       | Page number                                           |

**Sample Response**

```json
{
  "data": [
    {
      "id": "5498845288268871151",
      "name": "Giảm 50% cho khách hàng mới",
      "merchant": "shopee",
      "domain": "shopee.vn",
      "content": "Detailed promotion description...",
      "image": "https://static.accesstrade.vn/adv/img/example.png",
      "link": "https://shopee.vn/promotion-url",
      "aff_link": "https://go.isclix.com/deep_link/...",
      "start_time": "2025-01-04",
      "end_time": "2025-03-30",
      "categories": [],
      "banners": [{ "link": "https://...", "width": 300, "height": 250 }],
      "coupons": ["SAVE50"]
    }
  ]
}
```

---

### Create Tracking Link — generate product referral/affiliate links

This is the key endpoint for creating affiliate links from product URLs.

**curl**

```bash
curl -X POST 'https://api.accesstrade.vn/v1/product_link/create' \
  -H 'Authorization: Token <YOUR_ACCESS_KEY>' \
  -H 'Content-Type: application/json' \
  -d '{
    "campaign_id": "4348614231480407268",
    "urls": [
      "https://shopee.vn/product-page-1",
      "https://shopee.vn/product-page-2"
    ],
    "utm_source": "my_website",
    "utm_medium": "blog",
    "utm_campaign": "summer_sale",
    "utm_content": "banner_top",
    "url_enc": true,
    "sub1": "custom_tracking_1",
    "sub2": "custom_tracking_2",
    "sub3": "custom_tracking_3"
  }'
```

**Parameters**

| Parameter      | Required | Type    | Description                                             |
| -------------- | -------- | ------- | ------------------------------------------------------- |
| `campaign_id`  | Yes      | String  | Campaign ID (get from campaigns list endpoint)          |
| `urls`         | Yes      | Array   | Product/landing page URLs to convert to affiliate links |
| `utm_source`   | No       | String  | UTM source parameter                                    |
| `utm_medium`   | No       | String  | UTM medium parameter                                    |
| `utm_campaign` | No       | String  | UTM campaign parameter                                  |
| `utm_content`  | No       | String  | UTM content parameter                                   |
| `url_enc`      | No       | Boolean | Whether to URL-encode the links                         |
| `sub1`–`sub4`  | No       | String  | Custom sub-tracking parameters                          |

**Sample Response**

```json
{
  "success": true,
  "data": {
    "success_link": [
      {
        "url_origin": "https://shopee.vn/product-page-1",
        "aff_link": "https://go.isclix.com/deep_link/4348614231480407268?url=https%3A%2F%2Fshopee.vn%2Fproduct-page-1&utm_source=my_website&utm_medium=blog",
        "short_link": "https://shorten.asia/xxxxx",
        "first_link": null
      }
    ],
    "error_link": [],
    "suspend_url": []
  }
}
```

> **Tip:** The `short_link` is a shortened version of the affiliate link — ideal for sharing on social media. The `aff_link` is the full tracking URL.

---

### Get Transactions — track conversions and commissions

**curl**

```bash
curl -X GET 'https://api.accesstrade.vn/v1/transactions?since=2025-03-01T00:00:00Z&until=2025-03-30T00:00:00Z' \
  -H 'Authorization: Token <YOUR_ACCESS_KEY>' \
  -H 'Content-Type: application/json'
```

**Parameters**

| Parameter | Required | Description               |
| --------- | -------- | ------------------------- |
| `since`   | No       | Start datetime (ISO 8601) |
| `until`   | No       | End datetime (ISO 8601)   |

**Rate limit:** 10 requests per minute.

---

### Get Orders v2 — list orders

**curl**

```bash
curl -X GET 'https://api.accesstrade.vn/v1/order-list?since=2025-03-01T00:00:00Z&until=2025-03-30T00:00:00Z' \
  -H 'Authorization: Token <YOUR_ACCESS_KEY>' \
  -H 'Content-Type: application/json'
```

**Note:** Response is cached for 1 minute.

---

## 4. Typical Integration Flow

1. **Get your API token** from the publisher dashboard
2. **List campaigns** (`GET /v1/campaigns?approval=successful`) to find campaign IDs and merchant names
3. **Browse products** via datafeeds (`GET /v1/datafeeds?domain=shopee.vn`) — returns products with `aff_link` already included
4. **Or get promotions** (`GET /v1/offers_informations`) for vouchers/coupons/deals (also includes `aff_link`)
5. **Create custom affiliate links** (`POST /v1/product_link/create`) when you have raw URLs that need conversion (e.g., from your own product pages)
6. **Track performance** via transactions (`GET /v1/transactions`) and orders (`GET /v1/order-list`)

> **Key insight:** The `datafeeds` and `offers_informations` endpoints already return `aff_link` fields — you only need `product_link/create` when converting arbitrary URLs. The `top_products` endpoint may return empty results depending on data availability.

## 5. Sources

- [AccessTrade Developer Portal](https://developers.accesstrade.vn)
- [API Publisher English Docs](https://developers.accesstrade.vn/api-accesstrade-tai-lieu-tich-hop)
- [Authentication](https://developers.accesstrade.vn/api-accesstrade-tai-lieu-tich-hop/authentication)
- [Create Tracking Link](https://developers.accesstrade.vn/api-accesstrade-tai-lieu-tich-hop/create-tracking-link)
- [Get Campaigns List](https://developers.accesstrade.vn/api-accesstrade-tai-lieu-tich-hop/get-the-campaigns-list)
- [Top Selling Products](https://developers.accesstrade.vn/api-accesstrade-tai-lieu-tich-hop/top-selling-products)
- [Get Promotional Information](https://developers.accesstrade.vn/api-accesstrade-tai-lieu-tich-hop/get-promotional-information)
- [Get Datafeeds Information](https://developers.accesstrade.vn/api-accesstrade-tai-lieu-tich-hop/get-datafeeds-information)
- [Creative APIs (Global)](https://support.accesstrade.global/api/creative-apis.html)
