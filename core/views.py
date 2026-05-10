import json
import random
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def index(request):
    """Main landing page"""
    return render(request, 'core/index.html')


@csrf_exempt
def analyse(request):
    """
    Mock ATS analysis endpoint.
    Replace this with real AI (Claude/OpenAI) API calls later.
    Returns: JSON with ATS score, keywords, suggestions, rewrites
    """
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)

    try:
        body = json.loads(request.body)
        resume_text = body.get('resume', '').strip()
        job_desc    = body.get('job_desc', '').strip()
    except Exception:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)

    if not resume_text or not job_desc:
        return JsonResponse({'error': 'Both resume and job description are required'}, status=400)

    # ── MOCK DATA ─────────────────────────────────────────────────
    # Replace these with real AI API responses in production

    ats_score = random.randint(54, 91)

    matched_keywords = [
        "Python", "JavaScript", "REST API", "Git", "Problem Solving",
        "Agile", "Team Collaboration", "Communication", "Data Structures"
    ]

    missing_keywords = [
        "React.js", "TypeScript", "CI/CD", "Docker", "Unit Testing",
        "System Design", "AWS", "Node.js"
    ]

    suggestions = [
        {
            "category": "Keywords",
            "icon": "🔑",
            "title": "Add missing technical keywords",
            "detail": "Include React.js, TypeScript, and Docker to boost your ATS score by ~15 points."
        },
        {
            "category": "Impact",
            "icon": "📊",
            "title": "Quantify your achievements",
            "detail": "Use numbers and percentages. Replace 'improved performance' with 'improved load time by 40%'."
        },
        {
            "category": "Structure",
            "icon": "🏗️",
            "title": "Reorder your experience section",
            "detail": "Lead with the most relevant role. Hiring managers spend 6 seconds on a first scan."
        },
        {
            "category": "Format",
            "icon": "✍️",
            "title": "Strengthen action verbs",
            "detail": "Replace passive phrasing like 'responsible for' with 'architected', 'led', 'optimised'."
        },
        {
            "category": "Length",
            "icon": "📏",
            "title": "Trim to one page",
            "detail": "Entry-level and mid-level resumes should be concise. Remove roles older than 5–7 years."
        },
    ]

    bullet_rewrites = [
        {
            "original":  "Worked on the company website and helped fix bugs",
            "rewritten": "Engineered and deployed 12+ bug fixes for company website, reducing reported issues by 60% and improving user retention."
        },
        {
            "original":  "Did backend work using Python",
            "rewritten": "Architected scalable Python REST APIs serving 10,000+ daily requests with 99.9% uptime across microservices infrastructure."
        },
        {
            "original":  "Helped team with various projects",
            "rewritten": "Collaborated cross-functionally with 8-member engineering team to deliver 3 high-priority projects on schedule, reducing backlog by 35%."
        },
        {
            "original":  "Worked with databases",
            "rewritten": "Designed and optimised PostgreSQL schemas processing 500K+ records, achieving 3× query performance improvement through strategic indexing."
        },
    ]

    tailored_resume = f"""TAILORED RESUME — ATS OPTIMISED
{'═' * 55}

[YOUR NAME]
your.email@example.com  |  +91-XXXXXXXXXX
linkedin.com/in/yourprofile  |  github.com/yourusername

PROFESSIONAL SUMMARY
{'─' * 55}
Results-driven Software Developer with 2+ years of experience building scalable web applications using Python, JavaScript, and React.js. Proven track record in REST API development, CI/CD pipeline implementation, and Agile delivery. Passionate about writing clean, testable code and driving measurable business impact.

TECHNICAL SKILLS
{'─' * 55}
Languages:    Python, JavaScript, TypeScript, SQL
Frontend:     React.js, HTML5, CSS3, Tailwind CSS
Backend:      Node.js, Django, REST APIs, FastAPI
DevOps:       Docker, CI/CD, Git, GitHub Actions, AWS (EC2, S3)
Database:     PostgreSQL, MongoDB, Redis
Testing:      Unit Testing, pytest, Jest
Methodology:  Agile, Scrum, System Design

WORK EXPERIENCE
{'─' * 55}
Software Developer Intern  |  [Company Name]  |  Jan 2026 – Present
• Architected and deployed 12+ bug fixes for production web application, reducing reported issues by 60%
• Built scalable Python REST APIs serving 10,000+ daily requests with 99.9% uptime
• Collaborated with 8-member cross-functional team to deliver 3 high-priority projects on schedule
• Implemented CI/CD pipeline using GitHub Actions, reducing deployment time by 45%
• Optimised PostgreSQL schemas processing 500K+ records, achieving 3× query performance

EDUCATION
{'─' * 55}
Bachelor of Computer Applications (BCA)
[Your University]  |  2025 – 2028  |  CGPA: X.X/10

PROJECTS
{'─' * 55}
AI Resume Tailor  |  Python · Django · JavaScript · Claude API
• Built full-stack AI platform that analyses resumes against job descriptions with ATS scoring
• Integrated Claude API for intelligent keyword extraction and bullet point rewriting
• Deployed on Vercel with 200+ beta users

Job Application Tracker  |  HTML · CSS · JavaScript
• Developed Kanban-style dashboard with real-time stats, localStorage persistence, CSV export
• Features: search, filter, sort, full CRUD operations

CERTIFICATIONS
{'─' * 55}
• Responsive Web Design — freeCodeCamp
• Python for Everybody — Coursera

{'═' * 55}
✦ ATS Score: {ats_score}%  ✦ Keywords Matched: {len(matched_keywords)}  ✦ Optimised by Resume Tailor AI
"""

    return JsonResponse({
        'ats_score':        ats_score,
        'matched_keywords': matched_keywords,
        'missing_keywords': missing_keywords,
        'suggestions':      suggestions,
        'bullet_rewrites':  bullet_rewrites,
        'tailored_resume':  tailored_resume,
    })