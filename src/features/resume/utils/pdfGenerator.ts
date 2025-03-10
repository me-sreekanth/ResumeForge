import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { Resume } from "../../../shared/types/Resume";

export const generatePDF = async (resume: Resume) => {
  console.log("📝 Generating HTML for PDF...");
  
  const htmlContent = `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; margin: 0; font-size: 14px; }
          h1 { color: #2E74B5; text-align: center; margin-bottom: 5px; font-size: 24px; }
          h2 { color: #333; border-bottom: 2px solid #2E74B5; padding-bottom: 5px; margin-top: 15px; }
          h3 { color: #2E74B5; margin-bottom: 3px; font-size: 16px; }
          p, li { font-size: 14px; line-height: 1.5; margin: 5px 0; }
          ul { padding-left: 20px; }
          .contact { text-align: center; font-size: 12px; margin-bottom: 10px; }
          .section { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h1>${resume.name}</h1>
        <p class="contact"><strong>${resume.current_position}</strong><br>
        ${resume.contact.email} | ${resume.contact.phone} | 
        <a href="${resume.contact.linkedin}">LinkedIn</a> | 
        <a href="${resume.contact.github}">GitHub</a></p>

        <div class="section">
          <h2>Summary</h2>
          <p>${resume.summary.trim()}</p>
        </div>

        <div class="section">
          <h2>Skills</h2>
          <p>${resume.skills.join(", ").trim()}</p>
        </div>

        <div class="section">
          <h2>Experience</h2>
          ${resume.experience
            .map(
              (exp: Resume["experience"][0]) => `
                <h3>${exp.title} - ${exp.company} (${exp.years})</h3>
                <ul>${exp.details.map((detail: string) => `<li>${detail.trim()}</li>`).join("")}</ul>
              `
            )
            .join("")}
        </div>

        <div class="section">
          <h2>Projects</h2>
          ${resume.projects
            .map(
              (project: Resume["projects"][0]) => `
                <h3>${project.name}</h3>
                <p>${project.description.trim()}</p>
              `
            )
            .join("")}
        </div>

        <div class="section">
          <h2>Education</h2>
          ${resume.education
            .map(
              (edu: Resume["education"][0]) => `
                <p><strong>${edu.degree}</strong>, ${edu.institution} (${edu.year})</p>
              `
            )
            .join("")}
        </div>

        <div class="section">
          <h2>Achievements</h2>
          <ul>${resume.achievements.map((achievement: string) => `<li>${achievement.trim()}</li>`).join("")}</ul>
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    console.log(`✅ PDF generated successfully at: ${uri}`);
    return uri;
  } catch (error) {
    console.error("❌ Error generating PDF:", error);
    return null;
  }
};

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
