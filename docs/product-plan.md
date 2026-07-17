# Atlas Local — Master Product Plan v0.1

## 1. Product Positioning

**Atlas Local helps home-service businesses turn completed jobs and missed opportunities into more reviews, faster responses, and greater visibility on Google.**

The website is the acquisition offer. The software is the recurring product.

### The offer

**Free Website**

* Personalized website already built for the business.
* Hosted free on an Atlas Local subdomain.
* Customer can use a custom domain by paying the actual annual domain cost.
* Basic contact form and lead notifications.
* No complicated contract or website build fee.

**Atlas Local Growth — $297/month**

* Automated review requests.
* Missed-call text-back.
* Lead inbox and follow-up.
* Google Business Profile reporting and management.
* AI-generated review replies and Google posts.
* Website performance and lead tracking.
* Monthly growth report.
* AI business assistant.

The sales message becomes:

> “The website is yours either way. The $297 plan is the system that helps you get more reviews, respond to more leads, and improve your visibility every month.”

Do not describe the service as something that can guarantee rankings. Google says local results are primarily determined by relevance, distance, and prominence. Accurate information, reviews, responses, photos, and website authority can improve the business’s position, but nobody can purchase or guarantee placement.

---

## 2. The Core Product Loop

Everything should support one measurable cycle:

**Job completed → customer contacted → review or feedback received → review answered → content created → Google presence improves → more calls and leads → leads followed up → new job completed**

This gives the customer a reason to keep paying. A generic dashboard does not create retention; a recurring loop that visibly produces reviews, responses, calls, and leads does.

---

# 3. Customer-Side Product

## A. Home Dashboard

The dashboard should answer three questions immediately:

1. What happened?
2. What needs my attention?
3. Is Atlas Local helping me?

### Main cards

* Reviews received this month.
* Current Google rating.
* Review requests sent.
* Missed calls recovered.
* New website leads.
* Average lead response time.
* Google profile views, call clicks, website clicks, and direction requests.
* Website visits and conversions.
* “Estimated opportunities influenced,” only when supported by actual lead or invoice data.

### Today’s actions

Examples:

* Approve two drafted review replies.
* Upload photos from the latest project.
* Respond to one open lead.
* Approve this week’s Google post.
* Reconnect QuickBooks.
* Correct holiday hours.

The dashboard should feel like a short work queue, not an analytics warehouse.

---

## B. Reputation Engine

This is the first major retention feature.

### Ways to start a review request

* Manual “Send request” button.
* QuickBooks invoice marked paid.
* QuickBooks invoice with a zero remaining balance.
* Customer added manually.
* CSV upload.
* Website form or webhook.
* Future integrations with Jobber, Housecall Pro, ServiceTitan, Square, Stripe, or other systems.

QuickBooks Online supports OAuth and webhooks that notify your app when connected company records change. The safe workflow is to receive the event, retrieve the updated invoice or payment, confirm the invoice is actually paid, and only then evaluate the review-request rules.

### Per-account customization

Each business can configure:

* Trigger event.
* Delay after job completion.
* Sending hours.
* Number of reminders.
* SMS wording.
* Email wording.
* Sender name.
* Review link.
* Minimum time before the same customer can be contacted again.
* Which job types qualify.
* Whether the owner must approve requests.
* Preferred language.
* Private feedback link.
* Team notifications.

### Required safeguards

* Duplicate detection.
* Customer cooldown period.
* Global and account-level suppression lists.
* STOP and HELP handling.
* Consent source, date, and disclosure text.
* Delivery-status tracking.
* Failed-message retries.
* Quiet hours.
* Message-frequency limits.

The system must never practice review gating. Google prohibits selectively asking only satisfied customers for reviews, discouraging negative reviews, or offering incentives for reviews. Every qualifying customer should receive the same fair opportunity to leave an honest review.

A compliant request can offer both options to everyone:

* “Share your experience on Google.”
* “Send feedback directly to the business.”

The private-feedback option must not replace or hide the public-review option for dissatisfied customers.

### Review management

Once Google is connected:

* Import new reviews.
* Notify the owner.
* Draft a personalized reply with AI.
* Allow approve, edit, and publish.
* Track unanswered reviews.
* Flag reviews needing urgent attention.
* Show response-time statistics.

Google’s Business Profile APIs support retrieving and replying to reviews.

---

## C. Lead Recovery and Communications

This should be a focused lead inbox, not a full CRM.

### Lead sources

* Website forms.
* Website chat.
* Missed calls.
* Inbound text messages.
* Manual leads.
* Future Facebook lead forms.
* Future Google Ads leads.

### Lead record

Each lead should contain:

* Name and contact information.
* Requested service.
* Service address or ZIP code.
* Source.
* Original message.
* Conversation history.
* Assigned person.
* Status.
* Next action.
* Estimated job value.
* Appointment date.
* Won or lost result.

### Simple statuses

**New → Contacted → Appointment Set → Estimate Sent → Won/Lost**

Businesses should be able to rename or disable statuses, but V1 should not support arbitrary enterprise workflow building.

### Missed-call text-back

The preferred setup is:

1. Provision a Twilio number for the business.
2. Forward calls to the existing business phone.
3. Detect no-answer, busy, or failed calls.
4. Automatically send an approved text.
5. Place the resulting conversation in the lead inbox.

Alternative onboarding can use conditional call forwarding so only unanswered calls reach the Atlas Local number. Carrier behavior varies, so a dedicated tracking number is more dependable.

Example:

> “Hi, this is Harris Plumbing. Sorry we missed your call. What can we help you with?”

Use a separate Twilio subaccount for each customer. Twilio specifically supports subaccounts to isolate customer phone numbers, activity, configuration, and usage while keeping billing under the parent account.

US application-generated messages over local 10-digit numbers require A2P 10DLC registration. Because Atlas Local is embedding messaging for customers, it should be structured as an ISV and maintain registration status for every messaging customer.

Do not activate texting until:

* The business registration is complete.
* The use case is approved.
* Consent language is documented.
* STOP and HELP behavior works.
* The customer’s website contains the required messaging disclosures.

Consent should be explicit, voluntary, and separately documented rather than assumed merely because someone submitted a form or paid an invoice.

---

## D. Google Growth Center

This will eventually become one of the strongest differentiators.

### Reporting

Display:

* Search and Maps impressions.
* Call clicks.
* Website clicks.
* Direction requests.
* Search terms or keyword impressions when available.
* New reviews.
* Average rating.
* Review response rate.
* Photo and post activity.
* Comparison with the previous period.

Google’s Performance API exposes daily and monthly profile metrics, including impressions, calls, website clicks, directions, and search-keyword information.

### Profile management

* Business information review.
* Hours and special-hours reminders.
* Category and service checklist.
* Description suggestions.
* Review replies.
* Google post drafting and publishing.
* Offer and event posts.
* Photo-request workflow.
* Alerts for profile changes or new reviews.
* Monthly profile health assessment.

The Business Profile APIs support profile information, reviews, notifications, media, and several types of Google posts.

### Major implementation constraint

Google Business Profile API access is not automatically granted. Atlas Local needs:

* A valid Google Cloud project.
* A real business website.
* Privacy policy and terms.
* A Google account associated with a Business Profile.
* An application for Basic API Access.
* OAuth consent configuration.
* Approval before production access.

Google notes that approved projects must enable the associated Business Profile APIs and use OAuth authorization for each business.

Therefore, Google approval should begin immediately, but the rest of V1 must not depend on receiving it.

Before approval, provide:

* Manual profile audit.
* Customer-entered monthly metrics.
* CSV performance import.
* Links that take the user directly to the relevant Google management screen.
* AI drafts that the customer manually copies into Google.

---

## E. Content Engine

This should initially be **content assistance**, not a massive social-media scheduler.

### Workflow

1. Business uploads recent job photos.
2. Adds a sentence about the job.
3. AI creates:

   * Google Business Profile post.
   * Facebook post.
   * Short Instagram caption.
   * Website project entry.
   * Customer follow-up or referral message.
4. Owner approves or edits.
5. Connected channels publish where supported.

The most valuable V1 use is creating regular Google posts and website project content from real completed work.

Do not automatically post AI-generated or stock project images to Google. Google recommends location-relevant media captured by the business and warns against stock, heavily manipulated, or third-party imagery.

---

## F. Atlas AI

The AI should not be a generic blank chatbot.

It should already understand:

* Business services.
* Service areas.
* Hours.
* Brand voice.
* Offers.
* Team information.
* Website content.
* Google profile.
* Reviews.
* Leads.
* Connected performance data.
* Past approved responses and posts.

### AI tools

* Explain this month’s performance.
* Draft a review reply.
* Draft a Google post.
* Research a local topic or competitor.
* Suggest service pages.
* Turn job notes into content.
* Draft a lead response.
* Summarize open leads.
* Recommend today’s highest-value action.
* Identify missing business-profile information.
* Propose a monthly growth plan.

Use the OpenAI Responses API with web search and controlled function tools. Every external action should initially require approval.

### Per-account AI modes

* Draft only.
* Draft and request approval.
* Automatically perform low-risk actions.
* Completely disabled.

Also maintain account-level AI usage limits so one customer cannot create uncontrolled API costs.

---

# 4. Customer Navigation

Keep the initial application compact:

**Home | Reviews | Leads | Google | Content | Website | AI | Settings**

“Settings” contains:

* Business profile.
* Users and permissions.
* Integrations.
* Review-request rules.
* Messaging templates.
* Notifications.
* Billing.
* Usage.
* Domain.
* Branding.

---

# 5. Your Admin Application

Your admin side is equally important because your sales process is operationally unusual.

## A. Prospect Pipeline

### Pipeline stages

**Imported → Qualified → Website Selected → Website Ready → Call Queue → Contacted → Demo Viewed → Interested → Domain Paid → Onboarding → Active → Lost**

Each prospect record should include:

* Business name.
* Trade.
* City and service area.
* Phone and email.
* Google rating and review count.
* Current website status.
* Imported Outscraper and Apify data.
* Personalized website URL.
* Screenshots.
* Identified opportunities.
* Call attempts.
* Notes.
* Next action.
* Scheduled follow-up.
* Outcome.
* Assigned salesperson.

## B. Four-Hour Calling Mode

Before calling, you select and prepare a batch.

The calling screen should display one prospect at a time:

* Business information.
* Personalized website preview.
* Existing website.
* Google profile summary.
* Two or three specific problems.
* Recommended opening line.
* Phone number.
* Large call-result buttons.
* Fast note field.
* Next prospect button.

Possible results:

* No answer.
* Left voicemail.
* Call back.
* Text website.
* Demo sent.
* Interested.
* Not interested.
* Bad number.
* Sold free website.
* Sold $297 plan.

The system should automatically schedule the next step based on the selected outcome.

## C. Admin Work Queue

Your home screen should group work by blocking stage:

* Websites needing preparation.
* Prospects ready to call.
* Follow-ups due.
* Domains awaiting payment.
* Customers awaiting onboarding.
* Google connections requiring action.
* Twilio registrations pending.
* Content awaiting approval.
* Failed automations.
* Failed payments.
* Customers at risk of canceling.

## D. Customer Control Center

For each account, you need:

* Account information.
* Plan and subscription status.
* Enabled modules.
* Feature overrides.
* Usage limits.
* Website configuration.
* Domain status.
* Twilio subaccount and number.
* A2P registration status.
* Google connection.
* QuickBooks connection.
* Stripe customer.
* Message usage and costs.
* AI usage and costs.
* Automation history.
* Errors.
* Audit history.
* Secure “view as customer” support mode.

---

# 6. Customization Architecture

Do not customize clients by changing code or creating separate deployments.

Each account should have four separate control layers:

### 1. Entitlements

What the customer’s plan permits.

Example:

* Reviews: enabled.
* Missed-call text-back: enabled.
* Google publishing: disabled.
* AI: enabled.
* Included SMS: 500.

### 2. Account Overrides

Changes you make for an individual customer.

Example:

* Enable a beta feature.
* Increase SMS limit.
* Disable automatic reminders.
* Allow two locations.

### 3. Configuration

How the feature behaves.

Example:

* Send review request two hours after invoice payment.
* Send one reminder after three days.
* Owner must approve Google posts.
* Use friendly rather than formal wording.

### 4. Rollout Flags

Internal controls for testing new features.

Example:

* New review dashboard.
* New AI model.
* Experimental lead scoring.

This prevents the product from turning into a collection of customer-specific code branches.

---

# 7. Technical Foundation

## Recommended structure

* **Frontend and API:** Next.js.
* **Hosting:** Vercel.
* **Database:** Neon Postgres.
* **Website renderer:** Existing slug-based website system.
* **Files:** Object storage for logos, photos, and documents.
* **Billing:** Stripe.
* **Messaging and calls:** Twilio.
* **AI:** OpenAI Responses API.
* **Accounting integration:** QuickBooks Online.
* **Google:** Business Profile, Analytics, Search Console, and related APIs.
* **Background processing:** Database-backed job queue initially, behind a provider-neutral interface.
* **Monitoring:** Structured logs, integration health, webhook history, and retry controls.

Use one multi-tenant application and one website renderer. Every customer-owned row should include an `organization_id`, with server-side authorization enforced on every query.

## Core data groups

### Identity and tenancy

* organizations
* users
* memberships
* roles
* entitlements
* feature_overrides
* organization_settings

### Sales

* prospects
* prospect_sources
* websites
* call_attempts
* sales_notes
* follow_ups
* pipeline_events

### Customer communications

* contacts
* consent_records
* conversations
* messages
* calls
* leads
* lead_status_events

### Reputation

* review_campaigns
* review_requests
* review_request_attempts
* external_reviews
* review_replies
* suppression_records

### Integrations

* integration_connections
* encrypted_credentials
* webhook_events
* external_entity_links
* sync_runs
* sync_errors

### Automations

* automation_rules
* workflow_runs
* workflow_steps
* scheduled_jobs
* event_log
* failed_jobs

### Billing and usage

* subscriptions
* payments
* domains
* usage_records
* usage_limits
* vendor_costs

### AI and content

* ai_threads
* ai_messages
* tool_calls
* knowledge_documents
* content_drafts
* approvals
* published_content

### Security

* audit_logs
* support_access_logs
* data_exports
* deletion_requests

---

# 8. Integration Setup

## Google

Create separate development and production Google Cloud projects.

Production preparation:

* Public Atlas Local website.
* Privacy policy.
* Terms of service.
* Support email.
* OAuth consent screen.
* Authorized domains and redirect URLs.
* Least-privilege scopes.
* Encrypted refresh-token storage.
* Application for Business Profile Basic API Access.

## QuickBooks

* Create an Intuit developer application.
* Use its sandbox company first.
* Implement OAuth.
* Store the `realmID` for each company.
* Always store the newest refresh token returned by Intuit.
* Register production webhook URLs.
* Treat webhook deliveries as notifications, then fetch the authoritative record.
* Make all processing idempotent.

Intuit access tokens expire quickly, while refresh tokens rotate and must be replaced with the latest returned value.

## Twilio

* Main Atlas Local parent account.
* One subaccount per paying business.
* One Messaging Service per business.
* One or more phone numbers per business.
* A2P brand and campaign status stored in Atlas Local.
* Signed webhook validation.
* Delivery callbacks.
* Daily message-status reconciliation.
* Cost and usage limits.
* Automatic suspension for billing or compliance problems.

## Stripe

Create:

* One-time domain payment.
* $297 recurring subscription.
* Optional usage overages later.
* Stripe-hosted Checkout.
* Stripe customer portal.
* Webhooks for successful payments, failed payments, subscription changes, and cancellations.

Stripe’s hosted customer portal can handle payment-method changes, invoices, subscription management, and cancellation without requiring you to build those screens yourself.

## Domains and Vercel

Do not hardcode every domain at $20 because TLD prices vary.

Recommended flow:

1. Search availability through the Vercel Registrar API.
2. Show the actual annual price.
3. Create a Stripe one-time Checkout session.
4. Wait for confirmed payment.
5. Purchase the domain programmatically.
6. Use the client’s registrant information.
7. Attach it to the existing multi-tenant Vercel project.
8. Store renewal date and auto-renewal status.
9. Include the domain in the $297 plan or bill annual renewal separately.

Vercel provides registrar endpoints to search, price, purchase, renew, and manage domains programmatically.

Customers should be clearly told that a domain is an annual registration, not a permanent one-time purchase. Registering it with their contact information and providing a future transfer path will make the free-site offer more trustworthy.

---

# 9. Build Order

## Phase 0 — External approvals and product foundation

Start immediately:

* Google Cloud and Business Profile access application.
* Intuit developer app and sandbox.
* Twilio account and ISV/A2P preparation.
* Stripe product and price.
* Public privacy policy, terms, and messaging-consent language.
* Multi-tenant account model.
* Integration framework.
* Webhook event store.
* Audit logs.

## Phase 1 — Sellable foundation

Build:

* Admin prospect pipeline.
* Four-hour calling queue.
* Customer provisioning.
* Account feature controls.
* Customer login.
* Stripe subscription checkout.
* Domain-payment workflow.
* Basic customer dashboard.
* Website lead capture and notifications.

## Phase 2 — Reputation V1

Build:

* Contacts.
* Manual review requests.
* CSV upload.
* Native-phone “send from my phone” option.
* Request templates.
* Reminders.
* Deduplication.
* Consent records.
* Delivery history.
* Review goals.
* Manual review import until Google access is ready.

This can be sold before all third-party approvals are complete.

## Phase 3 — QuickBooks Automation

Build:

* Connect QuickBooks.
* Invoice and payment webhooks.
* Paid-invoice rules.
* Customer mapping.
* Review-request trigger.
* Reconnection and error handling.
* Full workflow history.

## Phase 4 — Twilio Communications

Build:

* Customer subaccount provisioning.
* Number provisioning.
* A2P status.
* Automated SMS review requests.
* Inbound replies.
* STOP and HELP handling.
* Missed-call text-back.
* Unified lead inbox.

## Phase 5 — Google Growth Center

Build after access approval:

* OAuth connection.
* Location selection.
* Performance metrics.
* Reviews and replies.
* Google posts.
* Business-information checks.
* Notifications.
* Monthly Google report.

## Phase 6 — AI and Content

Build:

* Business knowledge profile.
* AI chat.
* Tool permissions.
* Review-reply generation.
* Post generation.
* Performance explanations.
* Competitor and local-topic research.
* Approval workflows.
* Per-account AI budgets.

## Phase 7 — Additional Retention Features

Add based on customer demand:

* Estimate follow-up.
* Referral requests.
* Repeat-service reminders.
* Job-photo content pipeline.
* Search Console opportunities.
* Service-page recommendations.
* Basic local-rank tracking.
* Facebook and Instagram publishing.
* Additional field-service integrations.

---

# 10. Features to Avoid Initially

Do not build these into V1:

* Full sales CRM.
* Email marketing platform.
* Complex drag-and-drop automation builder.
* Paid advertising management.
* Full social-media calendar.
* Native mobile applications.
* Customer invoicing.
* Website visual page builder.
* Call-center system.
* AI that sends or publishes without controls.
* Integrations with ten field-service platforms simultaneously.
* Separate deployments or custom codebases for each customer.

These would delay the features directly responsible for the $297 value proposition.

---

# 11. Retention Features That Matter Most

The strongest monthly retention mechanism should be a simple report:

## “What Atlas Local Did This Month”

* Review requests sent.
* New reviews generated.
* Average rating change.
* Reviews answered.
* Missed calls automatically contacted.
* Leads received.
* Leads recovered.
* Appointments or jobs attributed.
* Google call clicks.
* Google website clicks.
* Website leads.
* Content created or published.
* Recommended next actions.

The report should also send by email and SMS so the customer sees the value even when they rarely log in.

Every result should be traceable. Avoid fake “growth scores” that cannot be explained. A contractor should be able to click a number and see the reviews, leads, calls, or messages behind it.

---

# 12. Working Brand

## Recommended working name

**Atlas Local**

### Product description

**The Google growth and customer follow-up system for home-service businesses.**

### Tagline options

* Turn completed jobs into reviews, calls, and repeat business.
* Get found. Respond faster. Win more local jobs.
* Your website, reviews, leads, and Google growth in one place.

The name should remain a working name until trademark, company-name, social-handle, and domain checks are completed.

---

# 13. Spec-Driven Development System

Create one permanent product constitution followed by small numbered specifications.

## Repository structure

```text
/specs
  000-product-constitution.md
  001-multitenancy-and-permissions.md
  002-admin-prospect-pipeline.md
  003-customer-onboarding-and-billing.md
  004-review-request-engine.md
  005-integration-framework.md
  006-quickbooks-integration.md
  007-twilio-messaging-and-calls.md
  008-google-business-profile.md
  009-lead-inbox.md
  010-atlas-ai.md
  011-content-engine.md
  012-reporting-and-attribution.md
```

Every specification should contain:

1. Problem and outcome.
2. Users and permissions.
3. User stories.
4. Exact screen states.
5. Business rules.
6. Data model.
7. API and event contracts.
8. External integration behavior.
9. Failure and retry behavior.
10. Security and privacy requirements.
11. Analytics events.
12. Acceptance criteria.
13. Non-goals.
14. Rollout plan.
15. Test fixtures.

No feature should be coded until its acceptance criteria, data ownership, failure states, and account customization behavior are defined.

---

# 14. First Concrete Product Milestone

The first milestone is complete when you can:

1. Import a prospect.
2. Attach its generated website.
3. Place it in your calling queue.
4. Record the call result.
5. Send a checkout link.
6. Convert the prospect into an organization.
7. Activate selected features.
8. Give the owner access.
9. Collect the $297 subscription.
10. Add a customer and send a tracked review request.
11. Show the resulting activity in both the customer dashboard and your admin logs.

That creates the full path from scraped business to paying software customer before the more difficult Google and telecommunications integrations are finished.
