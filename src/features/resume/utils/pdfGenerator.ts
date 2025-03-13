import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Resume } from "../../../shared/types/Resume";

// Function to generate the PDF with correct formatting
export const generatePDF = async (resume: Resume) => {
  console.log("📝 Generating HTML for PDF...");

  const htmlContent = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; margin: 0; font-size: 14px; }
          h1 { color: black; text-align: left; font-size: 22px; font-weight: bold; margin-bottom: 0px; }
          h2 { color: #2E74B5; font-size: 16px; font-weight: bold; margin-top: 20px; border-bottom: 2px solid #2E74B5; padding-bottom: 5px; }
          h3 { color: #2E74B5; font-size: 14px; font-weight: bold; margin-bottom: 5px; }
          p, li { font-size: 14px; line-height: 1.5; margin: 5px 0; }
          ul { padding-left: 20px; margin: 5px 0; }
          .contact { font-size: 12px; color: black; }
          .contact a { color: #2E74B5; text-decoration: none; font-weight: bold; }
          .divider { border-top: 1px solid black; margin: 10px 0; }
          .summary { text-align: justify; }
          .skills-container { display: flex; flex-wrap: wrap; gap: 6px; padding: 10px 0; }
          .skill { background-color: #F4C264; color: black; font-size: 12px; padding: 6px 10px; border-radius: 3px; font-weight: bold; display: inline-block; }
        </style>
      </head>
      <body>

        <h1>${resume.name || "No Name"}</h1>
        <p style="font-size: 14px; font-weight: bold; margin-bottom: 3px;">${resume.current_position || "No Position"}</p>
        <p class="contact">${resume.contact?.phone || "No Phone"} | ${resume.contact?.email || "No Email"} |
          <a href="https://${resume.contact?.linkedin || "#"}">LinkedIn</a> |
          <a href="https://${resume.contact?.github || "#"}">GitHub</a>
        </p>

        <div class="divider"></div>
        <div class="section"><p class="summary">${resume.summary?.trim() || "No Summary Available"}</p></div>
        <div class="divider"></div>

        <div class="section">
          <h2>SKILLS</h2>
          <div class="skills-container">${resume.skills?.length ? resume.skills.map(skill => `<span class="skill">${skill}</span>`).join(" ") : "<p>No Skills Listed</p>"}</div>
        </div>

        <div class="divider"></div>

        <div class="section">
          <h2>RELEVANT EXPERIENCE</h2>
          ${resume.experience?.map(exp => `
            <h3>${exp.company}</h3>
            <p><strong>${exp.title}</strong> | ${exp.location || "Location N/A"} | ${exp.years}</p>
            <ul>${exp.details.map(detail => `<li>${detail}</li>`).join("")}</ul>
          `).join("") || "<p>No experience listed</p>"}
        </div>

        <div class="divider"></div>

        <div class="section">
          <h2>PROJECTS</h2>
          ${resume.projects?.map(proj => `
            <h3>${proj.name}</h3>
            <p>${proj.description}</p>
          `).join("") || "<p>No projects listed</p>"}
        </div>

        <div class="divider"></div>

        <div class="section">
          <h2>ACHIEVEMENTS</h2>
          <ul>${resume.achievements?.map(ach => `<li>${ach}</li>`).join("") || "<p>No achievements listed</p>"}</ul>
        </div>

        <div class="divider"></div>

        <div class="section">
          <h2>EDUCATION</h2>
          ${resume.education?.map(edu => `
            <p><strong>${edu.degree}</strong> | ${edu.institution} (${edu.year})</p>
          `).join("") || "<p>No education listed</p>"}
        </div>

        <div class="divider"></div>
      </body>
    </html>`;

  console.log("📝 HTML Content for PDF Generated");

  try {
    // Add a small timeout before generating the PDF
    await new Promise((resolve) => setTimeout(resolve, 500));

    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    console.log(`✅ PDF generated successfully at: ${uri}`);
    return uri;
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    return null;
  }
};

// Function to share the generated PDF
export const sharePDF = async (pdfUri: string) => {
  console.log(`📤 Sharing PDF: ${pdfUri}`);

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(pdfUri);
    console.log("✅ PDF Shared successfully!");
  } else {
    console.error("❌ Sharing not available on this device.");
    alert("Sharing not available on this device.");
  }
};
