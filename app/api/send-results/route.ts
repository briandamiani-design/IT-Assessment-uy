import { type NextRequest, NextResponse } from "next/server"
import { jsPDF } from "jspdf"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  try {
    const { contactInfo, results, categoryScores, overallScore, maturityLevel } = await request.json()

    // Create PDF
    const doc = new jsPDF()

    // Header
    doc.setFontSize(20)
    doc.text("IT Maturity Assessment Results", 20, 30)

    // Contact Info
    doc.setFontSize(12)
    doc.text(`Name: ${contactInfo.fullName}`, 20, 50)
    doc.text(`Email: ${contactInfo.email}`, 20, 60)
    if (contactInfo.phone) {
      doc.text(`Phone: ${contactInfo.phone}`, 20, 70)
    }

    // Overall Score
    doc.setFontSize(16)
    doc.text(`Overall IT Maturity Score: ${overallScore}%`, 20, 90)
    doc.text(`Maturity Level: ${maturityLevel}`, 20, 105)

    // Category Scores
    doc.setFontSize(14)
    doc.text("Category Breakdown:", 20, 125)

    let yPosition = 140
    categoryScores.forEach((category: any) => {
      doc.setFontSize(12)
      doc.text(`${category.name}: ${category.score}% (${category.level})`, 25, yPosition)
      yPosition += 15
    })

    // Generate PDF as base64
    const pdfBase64 = doc.output("datauristring").split(",")[1]

    // Get first name for personalization
    const firstName = contactInfo.fullName.split(" ")[0]

    // Email content
    const emailContent = `Dear ${firstName},

Attached are the results of your Instant IT Maturity Assessment from Wendigo Advisors.

If you would like to talk about these results or have any questions, please reach out to us at info@wendigoadvisors.com.

Sincerely,
Wendigo Advisors`

    const resend = new Resend(process.env.RESEND_API_KEY)

    const emailResult = await resend.emails.send({
      from: "bdamiani@wendigoadvisors.com", // Using verified domain email address
      to: contactInfo.email,
      subject: "Your IT Maturity Assessment Results - Wendigo Advisors",
      text: emailContent,
      attachments: [
        {
          filename: "IT_Maturity_Assessment_Results.pdf",
          content: pdfBase64,
        },
      ],
    })

    console.log("[v0] Email API response:", emailResult)
    console.log("[v0] Email sent successfully to:", contactInfo.email)

    return NextResponse.json({ success: true, message: "Results sent successfully" })
  } catch (error) {
    console.error("[v0] Error sending results:", error)
    if (error instanceof Error) {
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Error stack:", error.stack)
    }
    return NextResponse.json({ success: false, error: "Failed to send results" }, { status: 500 })
  }
}
