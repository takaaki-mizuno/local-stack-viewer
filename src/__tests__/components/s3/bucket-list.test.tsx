import { render, screen } from "@testing-library/react";
import { BucketList } from "@/components/s3/bucket-list";
import { S3Bucket } from "@/app/actions/s3-actions";

const mockBuckets: S3Bucket[] = [
  {
    name: "test-bucket-1",
    creationDate: new Date("2025-01-01T00:00:00Z"),
  },
  {
    name: "test-bucket-2",
    creationDate: new Date("2025-01-02T00:00:00Z"),
  },
];

describe("BucketList", () => {
  test("バケットが存在しない場合の表示", () => {
    render(<BucketList buckets={[]} />);

    expect(screen.getByText("バケットがありません")).toBeInTheDocument();
    expect(
      screen.getByText("LocalStackでS3バケットを作成してください")
    ).toBeInTheDocument();
  });

  test("バケット一覧が正しく表示される", () => {
    render(<BucketList buckets={mockBuckets} />);

    expect(screen.getByText("test-bucket-1")).toBeInTheDocument();
    expect(screen.getByText("test-bucket-2")).toBeInTheDocument();
  });

  test("バケットの作成日が正しく表示される", () => {
    render(<BucketList buckets={mockBuckets} />);

    expect(screen.getByText("2025/1/1")).toBeInTheDocument();
    expect(screen.getByText("2025/1/2")).toBeInTheDocument();
  });

  test("バケットのリンクが正しく設定される", () => {
    render(<BucketList buckets={mockBuckets} />);

    const bucket1Link = screen.getByText("test-bucket-1").closest("a");
    const bucket2Link = screen.getByText("test-bucket-2").closest("a");

    expect(bucket1Link).toHaveAttribute("href", "/s3/test-bucket-1");
    expect(bucket2Link).toHaveAttribute("href", "/s3/test-bucket-2");
  });
});
