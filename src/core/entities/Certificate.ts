export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  certificateNumber: string;
  issuedAt: Date;
  pdfUrl: string | null;
}