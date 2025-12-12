import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import saveAs from "file-saver";

/**
 * A simple parser that takes Markdown-like text and creates a docx Paragraph structure.
 * This is a basic implementation for demonstration purposes.
 */
const parseMarkdownToDocxChildren = (text: string): Paragraph[] => {
  const lines = text.split('\n');
  const children: Paragraph[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line) {
      // Add an empty paragraph for spacing
      children.push(new Paragraph({ text: "" }));
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      children.push(new Paragraph({
        text: line.replace('# ', ''),
        heading: HeadingLevel.HEADING_1,
        spacing: { after: 200, before: 200 }
      }));
    } else if (line.startsWith('## ')) {
      children.push(new Paragraph({
        text: line.replace('## ', ''),
        heading: HeadingLevel.HEADING_2,
        spacing: { after: 150, before: 150 }
      }));
    } else if (line.startsWith('### ')) {
      children.push(new Paragraph({
        text: line.replace('### ', ''),
        heading: HeadingLevel.HEADING_3,
        spacing: { after: 120, before: 120 }
      }));
    } 
    // Bullet Lists (basic support)
    else if (line.startsWith('- ') || line.startsWith('* ')) {
       children.push(new Paragraph({
        text: line.substring(2),
        bullet: {
          level: 0
        }
      }));
    }
    // Standard Paragraph
    else {
      children.push(new Paragraph({
        children: [
          new TextRun({
            text: line,
            size: 24, // 12pt
          }),
        ],
        spacing: {
          after: 120
        }
      }));
    }
  }

  return children;
};

export const generateAndDownloadDocx = async (content: string, filename: string = "document.docx") => {
  const children = parseMarkdownToDocxChildren(content);

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: children,
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};