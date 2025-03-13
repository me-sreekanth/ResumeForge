import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Resume } from "../../../shared/types/Resume";

/* Constants for layout adjustments */
/* Constants for layout adjustments */
const PAGE_TOP_BOTTOM_MARGIN = "0.25in";  // Ensures consistent top/bottom margins
const PAGE_LEFT_RIGHT_MARGIN = "0in";  // Ensures consistent left/right margins
const SECTION_SPACING = "15px";  // Space between sections
const DIVIDER_SPACING = "12px";  // Space above/below section dividers
const BULLET_POINT_SPACING = "4px";  // Adjusted spacing between bullet points
const BULLET_POINT_LINE_HEIGHT = "1.3";  // Controls bullet point line height
const HEADER_FONT_SIZE = "24px";  // Main name font size
const SUBHEADER_FONT_SIZE = "16px"; // Section title font size
const NORMAL_FONT_SIZE = "14px";  // Regular text size
const SKILL_FONT_SIZE = "12px";  // Skill tag font size
const EXPERIENCE_TITLE_SIZE = "14px"; // Job title font size
const EXPERIENCE_COMPANY_SIZE = "14px"; // Company name font size


export const generatePDF = async (resume: Resume) => {
  console.log("📝 Generating HTML for PDF...");

  const htmlContent = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          /* Page setup with adjustable margins */
          @page {
            size: A4;
            margin: ${PAGE_TOP_BOTTOM_MARGIN} ${PAGE_LEFT_RIGHT_MARGIN};
          }

          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            font-size: ${NORMAL_FONT_SIZE};
            color: black;
          }

          h1 {
            font-size: ${HEADER_FONT_SIZE};
            font-weight: bold;
            margin-bottom: 5px;
            color: black;
          }

          h2 {
            color: #2E74B5;
            font-size: ${SUBHEADER_FONT_SIZE};
            font-weight: bold;
            margin-top: ${SECTION_SPACING};
            margin-bottom: 4px;
          }

          h3 {
            color: #2E74B5;
            font-size: ${EXPERIENCE_TITLE_SIZE};
            font-weight: bold;
            margin-bottom: 3px;
          }

          p, li {
            font-size: ${NORMAL_FONT_SIZE};
            line-height: 1.5;
            margin: 3px 0;
          }
li {
  margin-bottom: ${BULLET_POINT_SPACING};  /* Space between bullet points */
  line-height: ${BULLET_POINT_LINE_HEIGHT};  /* Adjusted line height for compactness */
}

          ul {
            padding-left: 18px;
            margin: 5px 0;
          }

          .contact {
            font-size: 12px;
            margin-top: 3px;
            color: black;
          }

          .contact a {
            color: #2E74B5;
            text-decoration: none;
            font-weight: bold;
          }

          /* Standard divider */
          .divider {
            border-top: 1px solid black;
            margin: ${DIVIDER_SPACING} 0;
          }

          /* Extra space for Projects divider */
          .divider.projects-divider {
            margin-top: 25px; /* Adds extra space above the Projects divider */
          }

          .summary {
            text-align: justify;
            font-size: 13px;
            margin-bottom: 8px;
          }

          .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 5px;
            padding: 5px 0;
          }

          .skill {
            background-color: #F4C264;
            color: black;
            font-size: ${SKILL_FONT_SIZE};
            padding: 5px 8px;
            border-radius: 3px;
            font-weight: bold;
            display: inline-block;
          }

          .experience-company {
            font-weight: bold;
            color: black;
            font-size: ${EXPERIENCE_COMPANY_SIZE};
          }

          .experience-title {
            font-size: ${EXPERIENCE_TITLE_SIZE};
            font-weight: bold;
            margin-bottom: 2px;
          }

          .experience-location {
            float: right;
            font-size: 13px;
          }

          .experience-years {
            float: right;
            font-size: 12px;
            font-style: italic;
            color: gray;
          }

          .section-title {
            font-size: ${SUBHEADER_FONT_SIZE};
            font-weight: bold;
            color: #2E74B5;
            margin-top: ${SECTION_SPACING};
            margin-bottom: 5px;
          }

          /* Ensures new sections have a top margin on new pages */
          .page-break {
            page-break-before: always;
            padding-top: ${PAGE_TOP_BOTTOM_MARGIN};
          }

          .project-container {
  margin-bottom: 8px;
}

.project-title {
  font-weight: bold;
  color: #000000;
  font-size: 14px;
  display: inline; /* Ensures it remains inline with the description */
}

.project-description {
  font-size: 14px;
  color: black;
  display: inline; /* Keeps description on the same line */
}
        </style>
      </head>
      <body>

        <!-- NAME & CONTACT SECTION -->
        <h1>${resume.name || "Your Name"}</h1>
        <p style="font-size: ${NORMAL_FONT_SIZE}; font-weight: bold; margin-bottom: 3px;">${resume.current_position || "Your Position"}</p>
        <p class="contact">
          ${resume.contact?.phone || "No Phone"} | ${resume.contact?.email || "No Email"} |
          <a href="https://${resume.contact?.linkedin || "#"}">LinkedIn</a> |
          <a href="https://${resume.contact?.github || "#"}">GitHub</a>
        </p>

        <div class="divider"></div>

        <!-- SUMMARY SECTION -->
        <div class="section">
          <p class="summary">${resume.summary?.trim() || "No Summary Available"}</p>
        </div>

        <div class="divider"></div>

        <!-- SKILLS SECTION -->
        <div class="section">
          <h2 class="section-title">SKILLS</h2>
          <div class="skills-container">
            ${resume.skills?.length ? resume.skills.map(skill => `<span class="skill">${skill}</span>`).join(" ") : "<p>No Skills Listed</p>"}
          </div>
        </div>

        <div class="divider"></div>

    <!-- EXPERIENCE SECTION -->
<div class="section">
  <h2 class="section-title">RELEVANT EXPERIENCE</h2>
  ${resume.experience?.map(exp => `
    <div style="display: flex; justify-content: space-between;">
      <h3 class="experience-company">${exp.company}</h3>
      <p class="experience-location">${exp.location || "Location N/A"}</p>
    </div>
    <p class="experience-title">${exp.title} <span class="experience-years">${exp.years}</span></p>
    <ul>${exp.details.map(detail => `<li>${detail}</li>`).join("")}</ul>
  `).join("") || "<p>No experience listed</p>"}
</div>

        <div class="divider projects-divider"></div>

        <!-- PROJECTS SECTION -->
<div class="section">
  <h2 class="section-title">PROJECTS</h2>
  ${resume.projects?.map(project => `
    <div class="project-container">
      <span class="project-title">${project.name}:</span>
      <span class="project-description"> ${project.description}</span>
    </div>
  `).join("") || "<p>No projects listed</p>"}
</div>

        <div class="divider"></div>

<!-- ACHIEVEMENTS SECTION -->
<div class="section">
  <h2 class="section-title">ACHIEVEMENTS</h2>
  <ul>${resume.achievements?.map(achievement => `<li>${achievement}</li>`).join("") || "<p>No achievements listed</p>"}</ul>
</div>


        <div class="divider"></div>

        <!-- EDUCATION SECTION -->
        <div class="section">
          <h2 class="section-title">EDUCATION</h2>
          ${resume.education?.map(edu => `
            <p><strong>${edu.degree}</strong> | ${edu.institution} (${edu.year})</p>
            <p>Grade: ${edu.grade} | ${edu.remarks || ""}</p>
          `).join("") || "<p>No education details available</p>"}
        </div>

      </body>
    </html>`;

  console.log("📝 HTML Content for PDF Generated");

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    console.log(`✅ PDF generated successfully at: ${uri}`);
    return uri;
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    return null;
  }
};

