import os
from datetime import datetime

OUTPUT_MD = "AI_Resume_Project_Source_Code.md"

FILES = [
    # ================= Backend =================
    r"D:\codes\AI_Resume_Project\server\server.js",
    r"D:\codes\AI_Resume_Project\server\config\db.js",
    r"D:\codes\AI_Resume_Project\server\config\ai.js",
    r"D:\codes\AI_Resume_Project\server\config\imagekit.js",
    r"D:\codes\AI_Resume_Project\server\models\User.js",
    r"D:\codes\AI_Resume_Project\server\models\Resume.js",
    r"D:\codes\AI_Resume_Project\server\controllers\authController.js",
    r"D:\codes\AI_Resume_Project\server\controllers\resumeController.js",
    r"D:\codes\AI_Resume_Project\server\controllers\aiController.js",
    r"D:\codes\AI_Resume_Project\server\routes\authRoutes.js",
    r"D:\codes\AI_Resume_Project\server\routes\resumeRoutes.js",
    r"D:\codes\AI_Resume_Project\server\routes\aiRoutes.js",
    r"D:\codes\AI_Resume_Project\server\middleware\authMiddleware.js",
    r"D:\codes\AI_Resume_Project\server\middleware\upload.js",
    r"D:\codes\AI_Resume_Project\server\utils\pdfParser.cjs",

    # ================= Frontend =================
    r"D:\codes\AI_Resume_Project\client\src\main.tsx",
    r"D:\codes\AI_Resume_Project\client\src\App.tsx",
    r"D:\codes\AI_Resume_Project\client\src\types\index.ts",
    r"D:\codes\AI_Resume_Project\client\src\lib\axios.ts",
    r"D:\codes\AI_Resume_Project\client\src\store\index.ts",
    r"D:\codes\AI_Resume_Project\client\src\store\slices\authSlice.ts",
    r"D:\codes\AI_Resume_Project\client\src\store\slices\resumeSlice.ts",
    r"D:\codes\AI_Resume_Project\client\src\pages\Dashboard.tsx",
    r"D:\codes\AI_Resume_Project\client\src\pages\ResumeBuilder.tsx",
    r"D:\codes\AI_Resume_Project\client\src\pages\Analyzer.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\builder\SectionSidebar.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\builder\sections\PersonalInfo.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\builder\sections\Summary.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\builder\sections\Experience.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\builder\sections\Education.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\builder\sections\Projects.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\builder\sections\Skills.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\builder\sections\Formatting.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\resume-templates\TemplateRenderer.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\resume-templates\ClassicTemplate.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\resume-templates\ModernTemplate.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\resume-templates\MinimalTemplate.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\analyzer\AnalysisResult.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\analyzer\ScoreCircle.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\layout\Layout.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\layout\Navbar.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\auth\Login.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\auth\Register.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\ui\Button.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\ui\Input.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\ui\Modal.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\ui\BulletListEditor.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\ui\ColorPicker.tsx",
    r"D:\codes\AI_Resume_Project\client\src\components\ui\DynamicLinks.tsx",
]

def lang_from_ext(path):
    ext = os.path.splitext(path)[1].lower()
    return {
        ".js": "javascript",
        ".ts": "typescript",
        ".tsx": "tsx",
        ".cjs": "javascript"
    }.get(ext, "text")

def generate_md():
    with open(OUTPUT_MD, "w", encoding="utf-8") as md:
        md.write("# 📘 AI Resume Builder & Analyzer – Source Code Reference\n\n")
        md.write("> **Auto-generated source code documentation**  \n")
        md.write(f"> Generated on: `{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}`\n\n")
        md.write("---\n\n")

        for idx, file_path in enumerate(FILES, 1):
            if not os.path.exists(file_path):
                continue

            file_name = os.path.basename(file_path)
            lang = lang_from_ext(file_path)

            md.write(f"## 📄 {idx}. `{file_name}`\n\n")
            md.write(f"**📍 Location:** `{file_path}`\n\n")

            with open(file_path, "r", encoding="utf-8", errors="replace") as f:
                content = f.read()

            md.write(f"```{lang}\n")
            md.write(content)
            md.write("\n```\n\n")
            md.write("---\n\n")

if __name__ == "__main__":
    generate_md()
    print("✅ Elegant markdown file created:", OUTPUT_MD)
