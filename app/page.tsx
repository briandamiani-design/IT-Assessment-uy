"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
  Shield,
  Server,
  Database,
  Cloud,
  Target,
  Lightbulb,
  Users,
  GraduationCap,
  CheckCircle,
  ArrowRight,
} from "lucide-react"

const questionRatings = {
  "How is your IT infrastructure managed?": {
    1: {
      label: "Ad-hoc",
      description: "No formal infrastructure management. Systems are managed reactively when issues arise.",
    },
    2: {
      label: "Basic",
      description: "Some documentation exists. Infrastructure is managed with basic tools and processes.",
    },
    3: {
      label: "Managed",
      description: "Standardized processes and tools are in place. Regular monitoring and maintenance schedules.",
    },
    4: {
      label: "Optimized",
      description: "Automated monitoring and management. Proactive maintenance with performance optimization.",
    },
    5: {
      label: "Strategic",
      description:
        "Fully automated, self-healing infrastructure with predictive analytics and continuous optimization.",
    },
  },
  "What is your approach to hardware lifecycle management?": {
    1: {
      label: "Reactive",
      description: "Hardware is replaced only when it fails. No lifecycle planning or tracking.",
    },
    2: { label: "Basic Tracking", description: "Basic inventory tracking with informal replacement planning." },
    3: {
      label: "Planned",
      description: "Regular lifecycle planning with scheduled replacements based on age and performance metrics.",
    },
    4: {
      label: "Optimized",
      description: "Data-driven lifecycle management with cost optimization and performance forecasting.",
    },
    5: {
      label: "Strategic",
      description:
        "Fully integrated lifecycle management with business alignment and predictive replacement strategies.",
    },
  },
  "How do you handle system downtime?": {
    1: {
      label: "Reactive",
      description: "Downtime is addressed as it occurs. No formal incident response procedures.",
    },
    2: {
      label: "Basic Response",
      description: "Some incident response procedures exist. Recovery is manual and time-consuming.",
    },
    3: {
      label: "Structured",
      description: "Formal incident response with defined roles. Some automated recovery procedures.",
    },
    4: {
      label: "Proactive",
      description: "Comprehensive monitoring with automated failover. Minimal downtime with quick recovery.",
    },
    5: {
      label: "Resilient",
      description: "Zero-downtime architecture with automatic failover and self-healing capabilities.",
    },
  },
  "Do you have a cybersecurity policy?": {
    1: { label: "None", description: "No formal cybersecurity policy exists. Security is handled ad-hoc." },
    2: { label: "Basic", description: "Basic security policy exists but may be outdated or incomplete." },
    3: { label: "Documented", description: "Comprehensive security policy that is regularly reviewed and updated." },
    4: { label: "Enforced", description: "Well-documented policy with regular compliance monitoring and enforcement." },
    5: {
      label: "Strategic",
      description: "Dynamic security policy integrated with business strategy and continuously evolved.",
    },
  },
  "How often do you conduct security assessments?": {
    1: { label: "Never", description: "No formal security assessments are conducted." },
    2: { label: "Reactive", description: "Security assessments only after incidents or when required by compliance." },
    3: { label: "Annual", description: "Regular annual security assessments with some follow-up actions." },
    4: { label: "Quarterly", description: "Quarterly assessments with systematic remediation and tracking." },
    5: {
      label: "Continuous",
      description: "Continuous security monitoring and assessment with real-time threat detection.",
    },
  },
  "What level of data protection do you have?": {
    1: { label: "Minimal", description: "Basic password protection with no encryption or backup strategy." },
    2: { label: "Basic", description: "Some encryption and irregular backups. Limited access controls." },
    3: { label: "Standard", description: "Regular backups, basic encryption, and role-based access controls." },
    4: {
      label: "Advanced",
      description: "Comprehensive encryption, automated backups, and detailed access monitoring.",
    },
    5: { label: "Enterprise", description: "End-to-end encryption, real-time backup, and advanced threat protection." },
  },
  "How is data used in decision-making?": {
    1: { label: "Intuition", description: "Decisions are made primarily based on intuition and experience." },
    2: { label: "Basic Reports", description: "Some basic reports are used but data analysis is limited." },
    3: { label: "Regular Analysis", description: "Regular data analysis supports most business decisions." },
    4: {
      label: "Advanced Analytics",
      description: "Advanced analytics and predictive modeling guide strategic decisions.",
    },
    5: {
      label: "AI-Driven",
      description: "AI and machine learning provide real-time insights for all decision-making.",
    },
  },
  "Do you have a centralized data repository?": {
    1: { label: "None", description: "Data is scattered across multiple systems with no central repository." },
    2: { label: "Basic", description: "Some data consolidation but multiple disconnected systems remain." },
    3: { label: "Partial", description: "Central repository for key data with some integration between systems." },
    4: { label: "Comprehensive", description: "Most data is centralized with good integration and data governance." },
    5: { label: "Enterprise", description: "Fully integrated data lake/warehouse with real-time data processing." },
  },
  "How do you ensure data quality?": {
    1: { label: "None", description: "No formal data quality processes or validation." },
    2: { label: "Manual", description: "Manual spot checks and basic validation when issues are discovered." },
    3: { label: "Systematic", description: "Regular data quality checks with documented processes." },
    4: { label: "Automated", description: "Automated data quality monitoring with exception reporting." },
    5: { label: "Continuous", description: "Real-time data quality monitoring with automated correction and alerts." },
  },
  "What is your cloud adoption level?": {
    1: { label: "None", description: "All systems are on-premises with no cloud services." },
    2: { label: "Basic", description: "Limited use of cloud services for non-critical applications." },
    3: { label: "Hybrid", description: "Mix of on-premises and cloud with some integration." },
    4: { label: "Cloud-First", description: "Most new applications are cloud-based with migration strategy." },
    5: { label: "Cloud-Native", description: "Fully cloud-native architecture with advanced cloud services." },
  },
  "Do you use DevOps practices?": {
    1: { label: "None", description: "Traditional development with separate development and operations teams." },
    2: { label: "Basic", description: "Some collaboration between dev and ops but limited automation." },
    3: { label: "Developing", description: "Basic CI/CD pipelines and some automated testing." },
    4: { label: "Advanced", description: "Comprehensive DevOps with automated deployment and monitoring." },
    5: { label: "Mature", description: "Full DevSecOps with continuous delivery and infrastructure as code." },
  },
  "How do you manage cloud costs?": {
    1: { label: "None", description: "No cloud cost monitoring or optimization." },
    2: { label: "Basic", description: "Monthly cost reviews with limited optimization actions." },
    3: { label: "Monitored", description: "Regular cost monitoring with some optimization initiatives." },
    4: {
      label: "Optimized",
      description: "Proactive cost optimization with automated scaling and resource management.",
    },
    5: {
      label: "Strategic",
      description: "Advanced FinOps practices with real-time cost optimization and forecasting.",
    },
  },
  "Is IT aligned with business goals?": {
    1: { label: "Disconnected", description: "IT operates independently with little business alignment." },
    2: { label: "Basic", description: "Some communication between IT and business but limited alignment." },
    3: { label: "Coordinated", description: "Regular meetings and planning sessions ensure basic alignment." },
    4: { label: "Integrated", description: "IT strategy is closely aligned with business strategy and goals." },
    5: {
      label: "Strategic",
      description: "IT is a strategic business partner driving innovation and competitive advantage.",
    },
  },
  "Do you have an IT roadmap?": {
    1: { label: "None", description: "No formal IT planning or roadmap exists." },
    2: { label: "Basic", description: "Informal planning with some documentation of future needs." },
    3: { label: "Documented", description: "Formal IT roadmap that is reviewed and updated annually." },
    4: {
      label: "Strategic",
      description: "Comprehensive roadmap aligned with business strategy and regularly updated.",
    },
    5: {
      label: "Dynamic",
      description: "Agile roadmap that adapts quickly to business changes and emerging technologies.",
    },
  },
  "How is IT performance measured?": {
    1: { label: "None", description: "No formal IT performance metrics or measurement." },
    2: { label: "Basic", description: "Basic uptime and incident tracking with limited reporting." },
    3: { label: "Standard", description: "Regular performance metrics with monthly reporting to management." },
    4: { label: "Comprehensive", description: "Detailed KPIs and dashboards with business impact measurement." },
    5: { label: "Strategic", description: "Advanced analytics measuring IT's contribution to business outcomes." },
  },
  "How do you approach digital innovation?": {
    1: { label: "Reactive", description: "Technology adoption only when absolutely necessary." },
    2: { label: "Follower", description: "Adopt proven technologies after others have validated them." },
    3: { label: "Selective", description: "Evaluate and adopt technologies that clearly benefit the business." },
    4: { label: "Proactive", description: "Actively explore emerging technologies and run pilot programs." },
    5: { label: "Leading", description: "Drive innovation with cutting-edge technologies and thought leadership." },
  },
  "Are emerging technologies evaluated?": {
    1: { label: "Never", description: "No evaluation of emerging technologies." },
    2: { label: "Rarely", description: "Occasional review of new technologies when problems arise." },
    3: { label: "Periodically", description: "Annual or semi-annual review of emerging technologies." },
    4: { label: "Regularly", description: "Quarterly evaluation with structured assessment process." },
    5: {
      label: "Continuously",
      description: "Ongoing technology radar with continuous evaluation and experimentation.",
    },
  },
  "How do you digitize customer experiences?": {
    1: { label: "None", description: "Customer interactions are primarily manual or paper-based." },
    2: { label: "Basic", description: "Some digital touchpoints but mostly traditional processes." },
    3: { label: "Developing", description: "Multiple digital channels with basic integration." },
    4: { label: "Advanced", description: "Comprehensive digital experience with personalization." },
    5: { label: "Innovative", description: "AI-powered, omnichannel experiences with predictive capabilities." },
  },
  "How is IT support delivered?": {
    1: { label: "Ad-hoc", description: "Support is provided informally when users ask for help." },
    2: { label: "Basic", description: "Basic help desk with email or phone support." },
    3: { label: "Structured", description: "Formal service desk with ticketing system and SLAs." },
    4: { label: "Proactive", description: "Proactive monitoring with self-service options and knowledge base." },
    5: { label: "Predictive", description: "AI-powered support with predictive issue resolution and automation." },
  },
  "How do users rate their IT experience?": {
    1: { label: "Poor", description: "Users frequently complain about IT services and reliability." },
    2: { label: "Below Average", description: "Users are generally dissatisfied with IT performance." },
    3: { label: "Acceptable", description: "Users find IT services adequate but not exceptional." },
    4: { label: "Good", description: "Users are generally satisfied with IT services and support." },
    5: { label: "Excellent", description: "Users view IT as a competitive advantage and enabler." },
  },
  "Are user feedback and satisfaction tracked?": {
    1: { label: "None", description: "No formal tracking of user feedback or satisfaction." },
    2: { label: "Informal", description: "Occasional informal feedback collection." },
    3: { label: "Basic", description: "Regular surveys or feedback collection with basic analysis." },
    4: { label: "Systematic", description: "Comprehensive feedback system with action plans and follow-up." },
    5: { label: "Continuous", description: "Real-time feedback with continuous improvement and user engagement." },
  },
  "How do you manage IT skill development?": {
    1: { label: "None", description: "No formal IT training or skill development programs." },
    2: { label: "Ad-hoc", description: "Occasional training when specific needs arise." },
    3: { label: "Planned", description: "Annual training plans with budget allocation for skill development." },
    4: { label: "Strategic", description: "Comprehensive skill development aligned with technology roadmap." },
    5: { label: "Continuous", description: "Continuous learning culture with personalized development paths." },
  },
  "Do you have a strategy for IT staffing?": {
    1: { label: "Reactive", description: "Hiring only when critical needs arise or people leave." },
    2: { label: "Basic", description: "Some workforce planning but mostly reactive to immediate needs." },
    3: { label: "Planned", description: "Annual staffing plans with consideration of future technology needs." },
    4: { label: "Strategic", description: "Comprehensive workforce strategy including skills gap analysis." },
    5: { label: "Dynamic", description: "Agile staffing model with mix of internal, contract, and partner resources." },
  },
  "How do you retain IT talent?": {
    1: { label: "None", description: "No specific retention strategies for IT staff." },
    2: { label: "Basic", description: "Standard HR practices with limited IT-specific retention efforts." },
    3: { label: "Focused", description: "Some IT-specific retention programs and career development." },
    4: {
      label: "Comprehensive",
      description: "Strong retention programs with career paths and competitive compensation.",
    },
    5: {
      label: "Strategic",
      description: "Industry-leading retention with innovation opportunities and flexible work arrangements.",
    },
  },
}

const assessmentData = {
  "Infrastructure & Operations": {
    icon: Server,
    questions: {
      "How is your IT infrastructure managed?": "Rate from 1 (lowest) to 5 (highest)",
      "What is your approach to hardware lifecycle management?": "Rate from 1 (lowest) to 5 (highest)",
      "How do you handle system downtime?": "Rate from 1 (lowest) to 5 (highest)",
    },
  },
  "Cybersecurity & Risk Management": {
    icon: Shield,
    questions: {
      "Do you have a cybersecurity policy?": "Rate from 1 (lowest) to 5 (highest)",
      "How often do you conduct security assessments?": "Rate from 1 (lowest) to 5 (highest)",
      "What level of data protection do you have?": "Rate from 1 (lowest) to 5 (highest)",
    },
  },
  "Data & Analytics": {
    icon: Database,
    questions: {
      "How is data used in decision-making?": "Rate from 1 (lowest) to 5 (highest)",
      "Do you have a centralized data repository?": "Rate from 1 (lowest) to 5 (highest)",
      "How do you ensure data quality?": "Rate from 1 (lowest) to 5 (highest)",
    },
  },
  "Cloud & DevOps": {
    icon: Cloud,
    questions: {
      "What is your cloud adoption level?": "Rate from 1 (lowest) to 5 (highest)",
      "Do you use DevOps practices?": "Rate from 1 (lowest) to 5 (highest)",
      "How do you manage cloud costs?": "Rate from 1 (lowest) to 5 (highest)",
    },
  },
  "IT Governance & Strategy": {
    icon: Target,
    questions: {
      "Is IT aligned with business goals?": "Rate from 1 (lowest) to 5 (highest)",
      "Do you have an IT roadmap?": "Rate from 1 (lowest) to 5 (highest)",
      "How is IT performance measured?": "Rate from 1 (lowest) to 5 (highest)",
    },
  },
  "Digital Transformation & Innovation": {
    icon: Lightbulb,
    questions: {
      "How do you approach digital innovation?": "Rate from 1 (lowest) to 5 (highest)",
      "Are emerging technologies evaluated?": "Rate from 1 (lowest) to 5 (highest)",
      "How do you digitize customer experiences?": "Rate from 1 (lowest) to 5 (highest)",
    },
  },
  "User Support & Experience": {
    icon: Users,
    questions: {
      "How is IT support delivered?": "Rate from 1 (lowest) to 5 (highest)",
      "How do users rate their IT experience?": "Rate from 1 (lowest) to 5 (highest)",
      "Are user feedback and satisfaction tracked?": "Rate from 1 (lowest) to 5 (highest)",
    },
  },
  "IT Talent & Skills": {
    icon: GraduationCap,
    questions: {
      "How do you manage IT skill development?": "Rate from 1 (lowest) to 5 (highest)",
      "Do you have a strategy for IT staffing?": "Rate from 1 (lowest) to 5 (highest)",
      "How do you retain IT talent?": "Rate from 1 (lowest) to 5 (highest)",
    },
  },
}

const ratingDescriptions = {
  1: {
    label: "Ad-hoc",
    description:
      "Processes are unpredictable, poorly controlled, and reactive. Work gets completed but is often delayed and over budget. Success depends on individual heroics.",
  },
  2: {
    label: "Initial",
    description:
      "Basic processes exist but are often ad hoc and inconsistent. Success is not repeatable and depends on individual effort. Limited documentation and standards.",
  },
  3: {
    label: "Basic",
    description:
      "Processes are characterized and fairly well understood. Standards, process descriptions, and procedures are established and improving over time.",
  },
  4: {
    label: "Developing",
    description:
      "Processes are quantitatively managed and controlled. Detailed measures of process performance are collected and analyzed. Quality and performance are predictable.",
  },
  5: {
    label: "Advanced",
    description:
      "Processes are continuously improved through incremental and innovative technological improvements. Focus on optimizing performance through both incremental and innovative process improvements.",
  },
}

const categoryColors = {
  "Infrastructure & Operations": "#3b82f6", // blue
  "Cybersecurity & Risk Management": "#ef4444", // red
  "Data & Analytics": "#10b981", // emerald
  "Cloud & DevOps": "#f59e0b", // amber
  "IT Governance & Strategy": "#8b5cf6", // violet
  "Digital Transformation & Innovation": "#06b6d4", // cyan
  "User Support & Experience": "#84cc16", // lime
  "IT Talent & Skills": "#f97316", // orange
}

export default function ITMaturityAssessment() {
  const [responses, setResponses] = useState<Record<string, Record<string, number>>>({})
  const [showResults, setShowResults] = useState(false)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [contactInfo, setContactInfo] = useState({
    fullName: "",
    email: "",
    phone: "",
  })

  const categories = Object.keys(assessmentData)
  const totalQuestions = categories.reduce(
    (acc, category) => acc + Object.keys(assessmentData[category as keyof typeof assessmentData].questions).length,
    0,
  )

  const answeredQuestions = Object.values(responses).reduce(
    (acc, categoryResponses) => acc + Object.keys(categoryResponses).length,
    0,
  )

  const progress = (answeredQuestions / totalQuestions) * 100

  const handleRatingChange = (category: string, question: string, rating: number) => {
    setResponses((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [question]: rating,
      },
    }))
  }

  const calculateCategoryScore = (category: string) => {
    const categoryResponses = responses[category] || {}
    const scores = Object.values(categoryResponses)
    if (scores.length === 0) return 0
    return Math.round((scores.reduce((sum, score) => sum + score, 0) / scores.length) * 20) // Convert to percentage
  }

  const calculateOverallScore = () => {
    const categoryScores = categories.map(calculateCategoryScore).filter((score) => score > 0)
    if (categoryScores.length === 0) return 0
    return Math.round(categoryScores.reduce((sum, score) => sum + score, 0) / categoryScores.length)
  }

  const getMaturityLevel = (score: number) => {
    if (score >= 80) return { level: "Advanced", color: "bg-green-500" }
    if (score >= 60) return { level: "Developing", color: "bg-blue-500" }
    if (score >= 40) return { level: "Basic", color: "bg-yellow-500" }
    if (score >= 20) return { level: "Initial", color: "bg-orange-500" }
    return { level: "Ad-hoc", color: "bg-red-500" }
  }

  const chartData = categories.map((category) => ({
    category: category.split(" ")[0], // Shortened for chart
    fullCategory: category,
    score: calculateCategoryScore(category),
    fill: categoryColors[category as keyof typeof categoryColors],
  }))

  const canShowResults = answeredQuestions >= totalQuestions

  const canSubmit = canShowResults && contactInfo.fullName.trim() && contactInfo.email.trim()

  const handleContactChange = (field: string, value: string) => {
    setContactInfo((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = async () => {
    if (canSubmit && !isSubmitting) {
      setIsSubmitting(true)
      console.log("[v0] Submitting assessment with contact info:", contactInfo)

      try {
        // Prepare results data
        const categoryScores = categories.map((category) => ({
          name: category,
          score: calculateCategoryScore(category),
          level: getMaturityLevel(calculateCategoryScore(category)).level,
        }))

        const overallScore = calculateOverallScore()
        const maturityLevel = getMaturityLevel(overallScore).level

        // Send results via API
        const response = await fetch("/api/send-results", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contactInfo,
            results: responses,
            categoryScores,
            overallScore,
            maturityLevel,
          }),
        })

        const result = await response.json()

        if (result.success) {
          console.log("[v0] Results sent successfully")
          setShowResults(true)
        } else {
          console.error("[v0] Failed to send results:", result.error)
          // Still show results even if email fails
          setShowResults(true)
        }
      } catch (error) {
        console.error("[v0] Error submitting assessment:", error)
        // Still show results even if there's an error
        setShowResults(true)
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  const autoFillForm = () => {
    // Fill contact information
    setContactInfo({
      fullName: "John Smith",
      email: "brian.damiani@gmail.com",
      phone: "(555) 123-4567",
    })

    // Fill all assessment questions with random ratings between 2-4 for realistic results
    const autoResponses: Record<string, Record<string, number>> = {}

    categories.forEach((category) => {
      const categoryData = assessmentData[category as keyof typeof assessmentData]
      const questions = Object.keys(categoryData.questions)
      autoResponses[category] = {}

      questions.forEach((question) => {
        // Generate ratings between 2-4 for more realistic assessment results
        autoResponses[category][question] = Math.floor(Math.random() * 3) + 2
      })
    })

    setResponses(autoResponses)
  }

  const generateRecommendations = () => {
    const categoryScores = categories.map((category) => ({
      name: category,
      score: calculateCategoryScore(category),
      level: getMaturityLevel(calculateCategoryScore(category)).level,
    }))

    // Sort categories by score (lowest first for prioritization)
    const sortedCategories = categoryScores.sort((a, b) => a.score - b.score)

    const recommendations = sortedCategories.map((category, index) => {
      const priority = index < 3 ? "High" : index < 6 ? "Medium" : "Low"
      const priorityColor =
        priority === "High" ? "bg-red-500" : priority === "Medium" ? "bg-yellow-500" : "bg-green-500"

      let recommendationText = ""
      let actionItems: string[] = []

      // Generate specific recommendations based on category and score
      if (category.score < 40) {
        // Critical improvements needed
        switch (category.name) {
          case "Infrastructure & Operations":
            recommendationText =
              "Your infrastructure requires immediate attention. Focus on establishing basic monitoring, documentation, and standardized processes."
            actionItems = [
              "Implement basic infrastructure monitoring tools",
              "Create documentation for all critical systems",
              "Establish regular maintenance schedules",
              "Develop incident response procedures",
            ]
            break
          case "Cybersecurity & Risk Management":
            recommendationText =
              "Critical security gaps exist. Immediate action is needed to protect your organization from cyber threats."
            actionItems = [
              "Develop and implement a comprehensive cybersecurity policy",
              "Conduct immediate security assessment",
              "Implement multi-factor authentication",
              "Establish regular security training programs",
            ]
            break
          case "Data & Analytics":
            recommendationText =
              "Data management is severely lacking. Focus on establishing basic data governance and quality processes."
            actionItems = [
              "Create a centralized data repository",
              "Implement basic data quality checks",
              "Establish data governance policies",
              "Train staff on data-driven decision making",
            ]
            break
          case "Cloud & DevOps":
            recommendationText =
              "Cloud adoption and DevOps practices need significant improvement to modernize your IT operations."
            actionItems = [
              "Develop a cloud migration strategy",
              "Implement basic CI/CD pipelines",
              "Establish cloud cost monitoring",
              "Train team on DevOps practices",
            ]
            break
          case "IT Governance & Strategy":
            recommendationText = "IT governance is weak. Establish clear alignment between IT and business objectives."
            actionItems = [
              "Create an IT strategic roadmap",
              "Establish regular IT-business alignment meetings",
              "Implement IT performance metrics",
              "Develop IT governance framework",
            ]
            break
          case "Digital Transformation & Innovation":
            recommendationText =
              "Digital innovation is lagging. Focus on establishing processes to evaluate and adopt new technologies."
            actionItems = [
              "Create a technology evaluation framework",
              "Establish innovation pilot programs",
              "Digitize key customer touchpoints",
              "Develop emerging technology radar",
            ]
            break
          case "User Support & Experience":
            recommendationText =
              "User experience is poor. Immediate improvements needed in IT support delivery and user satisfaction."
            actionItems = [
              "Implement a formal service desk system",
              "Establish service level agreements",
              "Create user feedback mechanisms",
              "Develop self-service capabilities",
            ]
            break
          case "IT Talent & Skills":
            recommendationText =
              "IT talent management needs urgent attention. Focus on skill development and retention strategies."
            actionItems = [
              "Conduct skills gap analysis",
              "Develop training and development programs",
              "Create career progression paths",
              "Implement talent retention strategies",
            ]
            break
        }
      } else if (category.score < 60) {
        // Moderate improvements needed
        recommendationText = `Your ${category.name.toLowerCase()} capabilities are developing but need enhancement to reach the next maturity level.`
        actionItems = [
          "Standardize existing processes and procedures",
          "Implement automation where possible",
          "Establish regular performance monitoring",
          "Invest in team training and development",
        ]
      } else if (category.score < 80) {
        // Good performance, optimization opportunities
        recommendationText = `Your ${category.name.toLowerCase()} capabilities are solid. Focus on optimization and advanced practices.`
        actionItems = [
          "Implement advanced analytics and reporting",
          "Optimize existing processes for efficiency",
          "Explore emerging technologies and best practices",
          "Share knowledge and mentor other teams",
        ]
      } else {
        // Excellent performance, maintain and innovate
        recommendationText = `Excellent performance in ${category.name.toLowerCase()}. Continue to innovate and lead by example.`
        actionItems = [
          "Continue to innovate and experiment",
          "Share best practices across the organization",
          "Mentor other teams and departments",
          "Stay ahead of industry trends and technologies",
        ]
      }

      return {
        category: category.name,
        score: category.score,
        level: category.level,
        priority,
        priorityColor,
        recommendation: recommendationText,
        actionItems,
      }
    })

    return recommendations
  }

  if (showRecommendations && canShowResults) {
    const recommendations = generateRecommendations()
    const overallScore = calculateOverallScore()
    const maturity = getMaturityLevel(overallScore)

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">IT Maturity Recommendations</h1>
            <p className="text-xl text-muted-foreground">Prioritized action plan based on your assessment results</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-3xl font-bold text-primary">{overallScore}%</div>
              <Badge className={`${maturity.color} text-white text-lg px-4 py-2`}>{maturity.level}</Badge>
            </div>
          </div>

          <div className="space-y-6">
            {recommendations.map((rec, index) => {
              const Icon = assessmentData[rec.category as keyof typeof assessmentData].icon
              const categoryColor = categoryColors[rec.category as keyof typeof categoryColors]

              return (
                <Card key={rec.category} className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6" style={{ color: categoryColor }} />
                        <CardTitle className="text-xl">{rec.category}</CardTitle>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge className={`${rec.priorityColor} text-white`}>{rec.priority} Priority</Badge>
                        <div className="text-right">
                          <div className="text-2xl font-bold" style={{ color: categoryColor }}>
                            {rec.score}%
                          </div>
                          <Badge className={`${getMaturityLevel(rec.score).color} text-white text-xs`}>
                            {rec.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed">{rec.recommendation}</p>
                    <div>
                      <h4 className="font-semibold text-foreground mb-3">Recommended Actions:</h4>
                      <ul className="space-y-2">
                        {rec.actionItems.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start gap-2">
                            <ArrowRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowRecommendations(false)} variant="outline">
                Back to Results
              </Button>
              <Button onClick={() => setShowResults(false)} variant="outline">
                Review Assessment
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Need help implementing these recommendations? Contact us at info@wendigoadvisors.com
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (showResults && canShowResults) {
    const overallScore = calculateOverallScore()
    const maturity = getMaturityLevel(overallScore)

    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-foreground">Assessment Results</h1>
            <div className="flex items-center justify-center gap-4">
              <div className="text-6xl font-bold text-primary">{overallScore}%</div>
              <div className="text-center">
                <Badge className={`${maturity.color} text-white text-lg px-4 py-2`}>{maturity.level}</Badge>
                <p className="text-muted-foreground mt-2">Overall IT Maturity</p>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Your maturity scores across all IT categories</CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  score: {
                    label: "Score",
                    color: "#3b82f6", // blue
                  },
                }}
                className="h-[400px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="category" />
                    <YAxis domain={[0, 100]} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="score" fill="dataKey" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {categories.map((category) => {
              const score = calculateCategoryScore(category)
              const maturity = getMaturityLevel(score)
              const Icon = assessmentData[category as keyof typeof assessmentData].icon
              const categoryColor = categoryColors[category as keyof typeof categoryColors]

              return (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5" style={{ color: categoryColor }} />
                      <CardTitle className="text-lg">{category}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold" style={{ color: categoryColor }}>
                        {score}%
                      </div>
                      <Badge className={`${maturity.color} text-white`}>{maturity.level}</Badge>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center space-y-4">
            <div className="flex justify-center gap-4">
              <Button onClick={() => setShowRecommendations(true)} size="lg" className="gap-2">
                View Recommendations
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button onClick={() => setShowResults(false)} variant="outline">
                Review Responses
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">IT Maturity Assessment</h1>
          <p className="text-xl text-muted-foreground">Evaluate your IT capabilities across 8 key categories</p>

          <div className="flex justify-center">
            <Button onClick={autoFillForm} variant="outline" size="sm" className="text-xs bg-transparent">
              Auto-Fill for Testing
            </Button>
          </div>

          <div className="space-y-2">
            <Progress value={progress} className="w-full max-w-md mx-auto" />
            <p className="text-sm text-muted-foreground">
              {answeredQuestions} of {totalQuestions} questions completed
            </p>
          </div>
        </div>

        {/* Contact Information */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl">Contact Information</CardTitle>
            <CardDescription>Please provide your details to receive your assessment results</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name *</Label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={contactInfo.fullName}
                  onChange={(e) => handleContactChange("fullName", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={contactInfo.email}
                  onChange={(e) => handleContactChange("email", e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={contactInfo.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                className="md:max-w-sm"
              />
            </div>
          </CardContent>
        </Card>

        {/* Assessment Categories */}
        <div className="space-y-6">
          {categories.map((category) => {
            const categoryData = assessmentData[category as keyof typeof assessmentData]
            const Icon = categoryData.icon
            const questions = Object.keys(categoryData.questions)
            const categoryResponses = responses[category] || {}
            const completedQuestions = Object.keys(categoryResponses).length

            return (
              <Card key={category} className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-6 w-6 text-primary" />
                      <CardTitle className="text-xl">{category}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      {completedQuestions === questions.length && <CheckCircle className="h-5 w-5 text-green-500" />}
                      <Badge variant="secondary">
                        {completedQuestions}/{questions.length}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {questions.map((question) => (
                    <div key={question} className="space-y-4">
                      <h4 className="font-medium text-foreground">{question}</h4>
                      <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((rating) => {
                          const questionRatingData = questionRatings[question as keyof typeof questionRatings]
                          const ratingData = questionRatingData?.[rating as keyof typeof questionRatingData] || null

                          // Always use fallback rating descriptions as backup
                          const fallbackRatingData = ratingDescriptions[rating as keyof typeof ratingDescriptions]

                          // Ensure we always have valid data
                          const displayLabel = ratingData?.label || fallbackRatingData?.label || `Level ${rating}`
                          const displayDescription =
                            ratingData?.description ||
                            fallbackRatingData?.description ||
                            `Rating level ${rating} description`

                          return (
                            <div
                              key={rating}
                              className={`p-4 border rounded-lg cursor-pointer transition-all hover:bg-muted/50 ${
                                categoryResponses[question] === rating
                                  ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                                  : "border-border"
                              }`}
                              onClick={() => handleRatingChange(category, question, rating)}
                            >
                              <div className="flex items-start gap-4">
                                <div
                                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-semibold text-sm flex-shrink-0 ${
                                    categoryResponses[question] === rating
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-muted-foreground text-muted-foreground"
                                  }`}
                                >
                                  {rating}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-foreground mb-2">{displayLabel}</div>
                                  <div className="text-sm text-muted-foreground leading-relaxed">
                                    {displayDescription}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Submit Button */}
        <div className="text-center space-y-4">
          {canShowResults && (
            <>
              {!contactInfo.fullName.trim() || !contactInfo.email.trim() ? (
                <p className="text-sm text-muted-foreground">
                  Please complete the contact information above to submit your assessment
                </p>
              ) : null}
              <Button onClick={handleSubmit} size="lg" className="gap-2" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? (
                  <>
                    Sending Results...
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  </>
                ) : (
                  <>
                    Submit Assessment & View Results
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
              {isSubmitting && (
                <p className="text-sm text-muted-foreground">Generating PDF and sending results to your email...</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
