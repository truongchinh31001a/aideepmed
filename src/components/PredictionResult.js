import { Card, Button } from 'antd';
import { useRouter } from 'next/navigation'; // Import useRouter để điều hướng

export default function PredictionResult({ result }) {
  const router = useRouter(); // Sử dụng useRouter để điều hướng

  if (!result || !result.profile || !result.profile.images) {
    return <p>No result available.</p>;
  }

  const { images } = result.profile;

  return (
    <>
      <h1 className="text-4xl font-bold text-red-500 mb-4">Result</h1>
      <p className="text-lg text-blue-400 mb-4">Your diagnosis is as follows:</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
        {images.map((image, index) => (
          <Card
            key={index}
            hoverable
            cover={<img alt={image.originalname} src={image.path} />}
            className="shadow-lg mx-auto"
            style={{
              width: '230px', // Đặt chiều rộng tiêu chuẩn cho card
              height: 'auto',
              borderRadius: '10px', // Bo tròn các cạnh của card
              border: '1px solid #dcdcdc', // Thêm viền cho card
              boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.1)', // Shadow box
            }}
          >
            <div className="text-center text-lg font-semibold">
              {image.thirdPartyInfo
                ? `Diagnosis: ${image.thirdPartyInfo.predictions[0][1]}`
                : 'No diagnosis available'}
            </div>
          </Card>
        ))}
      </div>

      {/* Nút Về lại trang */}
      <div className="mt-8 text-center">
        <Button
          type="primary"
          onClick={() => router.back()} // Điều hướng về trang trước đó
        >
          Về lại trang
        </Button>
      </div>

      {/* Styles */}
      <style jsx>{`
        .grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr); /* 1 card trên 1 hàng cho màn hình nhỏ */
        }

        @media (min-width: 768px) {
          .grid {
            grid-template-columns: repeat(2, 1fr); /* 2 card trên 1 hàng cho màn hình vừa */
          }
        }

        @media (min-width: 1024px) {
          .grid {
            grid-template-columns: repeat(3, 1fr); /* 3 card trên 1 hàng cho màn hình lớn */
          }
        }
      `}</style>
    </>
  );
}
