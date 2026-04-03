# Use the Stripe CLI

Build, test, and manage your Stripe integration from the command line.

For more details, see the [Stripe CLI reference](https://docs.stripe.com/cli.md).

The Stripe CLI lets you build, test, and manage your Stripe integration from the command line. With the CLI, you can create and manage Stripe resources, trigger webhook events, stream real-time API request logs, and forward events to your local development environment.

## Specify an API version while running requests

When you call Stripe APIs in the CLI, it uses your default API version in all requests, which you can [identify in Workbench](https://docs.stripe.com/workbench/guides.md#view-api-versions). To try out different API versions in the CLI, use the following flags:

| Flag                                 | Description                                                                   | Example                                                                         |
| ------------------------------------ | ----------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `--stripe-version 2026-03-25.dahlia` | Use the `--stripe-version` flag in any CLI request to specify an API version. | `stripe products create --name=“My Product” --stripe-version 2026-03-25.dahlia` |
| `--latest`                           | Use the `--latest` flag in any CLI request to specify the latest API version. | `stripe products create --name="My Product" --latest`                           |

You can also [view a list of API versions](https://docs.stripe.com/upgrades.md#api-versions).

## Learn about command options

To learn about options for specific commands, add `--help` to the command.

```bash
   stripe listen --help
```

## Stream request logs

Use the `stripe logs tail` command to stream API request logs. Keep this window open. If you have an error in your API calls, this terminal returns the API error message and a reason for the error.

```bash
  stripe logs tail
```

## Forward events to your local webhook endpoint

Use the `--forward-to` flag to send all [Stripe events](https://docs.stripe.com/cli/trigger#trigger-event) in a **sandbox** to your local webhook endpoint. To disable HTTPS certificate verification, use the `--skip-verify` flag.

```bash
  stripe listen --forward-to localhost:4242/webhooks
```

```bash
  Ready! Your webhook signing secret is '{{WEBHOOK_SIGNING_SECRET}}' (^C to quit)
```

To forward specific events in a comma separated list, use the `--events` flag.

```bash
stripe listen --events payment_intent.created,customer.created,payment_intent.succeeded,charge.succeeded,checkout.session.completed,charge.failed \
  --forward-to localhost:4242/webhook
```

If you’ve already [registered your endpoint in Stripe](https://docs.stripe.com/webhooks.md#register-webhook), you can use the `--load-from-webhooks-api` and `--forward-to` flags.

```bash
stripe listen --load-from-webhooks-api --forward-to localhost:4242
```

This command forwards events sent to your Stripe-registered **public** webhook endpoint to your **local** webhook endpoint. It loads your registered endpoint, parses the path and its registered events, then appends the path to your local webhook endpoint in the `--forward-to` path. If you’re checking webhook signatures, use the `{{WEBHOOK_SIGNING_SECRET}}` from the initial output of the `listen` command.

## List all available events

Use the [help flag](https://docs.stripe.com/cli/help) (`--help`) to list all possible events that can occur for an event category. For example, to list all possible events for the [prebuilt checkout page](https://docs.stripe.com/checkout/quickstart.md) for [Stripe Checkout](https://docs.stripe.com/payments/checkout.md):

```bash
  stripe trigger checkout --help
```

## Create a one-time product and price

1. Make a single API request to [Create a product](https://docs.stripe.com/api/products/create.md).

   ```bash
   stripe products create \
   --name="My First Product" \
   --description="Created with the Stripe CLI"
   ```

1. Look for the product identifier (in `id`) in the response object. Save it for the next step. If everything worked, the command-line displays the following response:

   ```json
   {
     "id": "prod_LTenIrmp8Q67sa", // The identifier looks like this.
     "object": "product",
     "active": true,
     "attributes": [],
     "created": 1668198126,
     "default_price": null,
     "description": "Created with the Stripe CLI",
     "identifiers": {},
     "images": [],
     "livemode": false,
     "metadata": {},
     "name": "My First Product",
     "package_dimensions": null,
     "price": null,
     "product_class": null,
     "shippable": null,
     "sku": "my-first-product-10",
     "statement_descriptor": null,
     "tax_code": null,
     "type": "service",
     "unit_label": null,
     "updated": 1668198126,
     "url": null
   }
   ```

1. Call [Create a price](https://docs.stripe.com/api/prices/create.md) to attach a price of 30 USD. Swap the placeholder in `product` with your product identifier (for example, `prod_LTenIrmp8Q67sa`).

   ```bash
   stripe prices create \
     --unit-amount=3000 \
     --currency=usd \
     --product="{{PRODUCT_ID}}"
   ```

1. If everything worked, the command-line displays the following response:

   ```json
   {
     "id": "price_1KzlAMJJDeE9fu01WMJJr79o", // The identifier looks like this.
     "object": "price",
     "active": true,
     "billing_scheme": "per_unit",
     "created": 1652636348,
     "currency": "usd",
     "livemode": false,
     "lookup_key": null,
     "metadata": {},
     "nickname": null,
     "product": "prod_Lh9iTGZhb2mcBy",
     "recurring": null,
     "tax_behavior": "unspecified",
     "tiers_mode": null,
     "transform_quantity": null,
     "type": "one_time",
     "unit_amount": 3000,
     "unit_amount_decimal": "3000"
   }
   ```

## Trigger a webhook event while testing

Trigger the `checkout.session.completed` event to create the API objects that result from a checkout session successfully completing.

```bash
stripe trigger checkout.session.completed
```

Your `stripe listen` terminal displays the following output:

```bash
Setting up fixture for: checkout_session
Running fixture for: checkout_session
Setting up fixture for: payment_page
Running fixture for: payment_page
Setting up fixture for: payment_method
Running fixture for: payment_method
Setting up fixture for: payment_page_confirm
Running fixture for: payment_page_confirm
Trigger succeeded!
```