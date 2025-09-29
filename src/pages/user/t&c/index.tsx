import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/user/form">
            <Button
              variant="outline"
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              ← Back to Registration
            </Button>
          </Link>
        </div>

        <Card className="shadow-xl border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
            <CardTitle className="text-2xl font-bold flex items-center gap-3">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Terms & Conditions – Furniture Touch-Up Subscription Service
            </CardTitle>
            <p className="text-primary-foreground/90 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>

          <CardContent className="p-8 bg-card">
            <div className="prose max-w-none text-card-foreground">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">1. Scope of Service</h2>
                <p>Service applies only to wooden furniture (solid wood, veneer, MDF with wood finish).</p>
                <p className="mt-2 font-medium">Includes minor cosmetic touch-ups and repairs such as:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Scratch and dent correction</li>
                  <li>Minor chip and edge damage repairs</li>
                  <li>Light polishing and finish restoration</li>
                </ul>
                <p className="mt-2 font-medium">Excludes:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Major refinishing or repainting</li>
                  <li>Structural repairs (broken legs, cracked frames, loose joints)</li>
                  <li>Upholstery work (except as separately quoted add-on)</li>
                  <li>Damage from fire, water, pests, mold, or natural disasters</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">2. Number of Furniture Items Covered</h2>
                <p>
                  Each subscription plan covers up to <strong>X</strong> pieces of wooden furniture per household 
                  (recommend: 3–5).
                </p>
                <p>Additional items can be covered at a flat rate of $___ per item per service visit.</p>
                <p>Covered items must be registered with photos during subscription signup.</p>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">3. Service Limitations</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Services are provided at our sole discretion based on professional assessment of repair feasibility.</li>
                  <li>Touch-ups do not guarantee an exact color or texture match due to natural wood variations.</li>
                  <li>We are not responsible for pre-existing structural or hidden damage discovered during service.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">4. Waiting Period & Eligibility</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>First service available 90 days after subscription start (grace period).</li>
                  <li>Missed or unused service appointments do not carry over to the next subscription period.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">5. Appointment Scheduling & Access</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>All appointments must be scheduled at least 7 days in advance.</li>
                  <li>Customer must provide safe, unobstructed access to furniture at the time of service.</li>
                  <li>Missed appointments without 24-hour notice will count as a fulfilled service.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">6. Liability Disclaimer</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>We are not liable for incidental damages during repair (unless caused by gross negligence).</li>
                  <li>We are not liable for any future deterioration or damage to the repaired area.</li>
                  <li>We are not liable for damage caused by misuse, poor maintenance, or environmental factors (humidity, sunlight, etc.).</li>
                  <li>Maximum liability in any claim is limited to the total subscription fees paid in the last 6 months.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">7. Cancellation Policy</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscriptions may be canceled anytime, but no refunds for unused service months.</li>
                  <li>If cancellation occurs before first eligible service, no partial refunds are provided after payment processing.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">8. Fair Use Policy</h2>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Subscription is intended for normal household wear and tear only.</li>
                  <li>Commercial use (restaurants, offices, Airbnb) requires a business plan subscription.</li>
                  <li>Excessive or intentional damage may result in additional charges or termination of service.</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold text-foreground mb-4">9. Governing Law</h2>
                <p>
                  All terms and disputes are governed by the laws of <strong>[Your State/Country]</strong>.
                  In case of legal disputes, arbitration will be the preferred method of resolution before court action.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
