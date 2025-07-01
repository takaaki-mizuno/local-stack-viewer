import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";

// Next.js navigationのモック
jest.mock("next/navigation", () => ({
  usePathname: jest.fn(),
}));

const mockUsePathname = usePathname as jest.MockedFunction<typeof usePathname>;

describe("Navigation", () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue("/");
  });

  test("ナビゲーションアイテムが正しく表示される", () => {
    render(<Navigation />);

    expect(screen.getByText("LocalStack Viewer")).toBeInTheDocument();
    expect(screen.getByText("ダッシュボード")).toBeInTheDocument();
    expect(screen.getByText("S3")).toBeInTheDocument();
    expect(screen.getByText("SES")).toBeInTheDocument();
  });

  test("アクティブなページが正しくハイライトされる", () => {
    mockUsePathname.mockReturnValue("/s3");
    render(<Navigation />);

    const s3Link = screen.getByText("S3").closest("a");
    expect(s3Link).toHaveClass("bg-accent");
  });

  test("リンクが正しいURLを持つ", () => {
    render(<Navigation />);

    expect(screen.getByText("ダッシュボード").closest("a")).toHaveAttribute(
      "href",
      "/"
    );
    expect(screen.getByText("S3").closest("a")).toHaveAttribute("href", "/s3");
    expect(screen.getByText("SES").closest("a")).toHaveAttribute(
      "href",
      "/ses"
    );
  });
});
