import Header from "./_components/Header";
import { ReservationProvider } from "./_components/ReservationContext";
import "./_styles/globals.css";

//这里是从next自己的服务器里下载Google字体
import { Josefin_Sans } from "next/font/google";
const josefin = Josefin_Sans({
  subsets: ["latin"],
  display: "swap",
});

//这一步是给整个网页的title进行命名
export const metadata = {
  // title: "The Wild Oasis",
  title: {
    template: "The Wild Oasis | %s", //这里，其他子页面的metadata就会代替%s的位置
    default: "Welcome | The Wild Oasis ", //如果一个页面没有自己的metadata，那么就会是这个初始值
  },
  description:
    "Luxurious cabin hotel, located in the heart of the Italian Dolomites,surrounded by beatutiful mountains and dark forests",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${josefin.className} antialiased bg-primary-900 text-primary-100 min-h-screen flex flex-col relative`}
      >
        <Header></Header>

        <div className="felx-1 px-8 py-12 grid">
          {/* children会渲染任何选中页面中的内容 */}
          <main className="max-w-7xl  mx-auto w-full">
            <ReservationProvider>{children}</ReservationProvider>
          </main>{" "}
        </div>
      </body>
    </html>
  );
}
