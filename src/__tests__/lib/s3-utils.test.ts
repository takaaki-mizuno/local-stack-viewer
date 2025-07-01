import { formatFileSize, isImageFile } from "@/lib/s3-utils";

describe("S3 Utils", () => {
  describe("formatFileSize", () => {
    test("0バイトを正しくフォーマット", () => {
      expect(formatFileSize(0)).toBe("0 B");
    });

    test("バイト単位を正しくフォーマット", () => {
      expect(formatFileSize(500)).toBe("500 B");
    });

    test("キロバイト単位を正しくフォーマット", () => {
      expect(formatFileSize(1024)).toBe("1 KB");
      expect(formatFileSize(1536)).toBe("1.5 KB");
    });

    test("メガバイト単位を正しくフォーマット", () => {
      expect(formatFileSize(1048576)).toBe("1 MB");
      expect(formatFileSize(2097152)).toBe("2 MB");
    });

    test("ギガバイト単位を正しくフォーマット", () => {
      expect(formatFileSize(1073741824)).toBe("1 GB");
    });

    test("大きなファイルサイズを正しくフォーマット", () => {
      expect(formatFileSize(1099511627776)).toBe("1 TB");
    });
  });

  describe("isImageFile", () => {
    test("画像ファイルを正しく判定", () => {
      expect(isImageFile("image/jpeg")).toBe(true);
      expect(isImageFile("image/png")).toBe(true);
      expect(isImageFile("image/gif")).toBe(true);
      expect(isImageFile("image/webp")).toBe(true);
      expect(isImageFile("image/svg+xml")).toBe(true);
    });

    test("非画像ファイルを正しく判定", () => {
      expect(isImageFile("text/plain")).toBe(false);
      expect(isImageFile("application/pdf")).toBe(false);
      expect(isImageFile("video/mp4")).toBe(false);
      expect(isImageFile("audio/mp3")).toBe(false);
    });

    test("undefinedやnullを正しく処理", () => {
      expect(isImageFile(undefined)).toBe(false);
      expect(isImageFile("")).toBe(false);
    });
  });
});
