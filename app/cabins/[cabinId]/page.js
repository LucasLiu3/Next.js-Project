import Cabin from "@/app/_components/Cabin";
import Reservation from "@/app/_components/Reservation";
import Spinner from "@/app/_components/Spinner";
import { getCabin, getCabins } from "@/app/_lib/data-service";
import { Suspense } from "react";

//如果需要从fetch的data里面取信息去渲染页面的title，那么就用这个方法，不然就是前面的老办法
export async function generateMetadata({ params }) {
  const cabin = await getCabin(params.cabinId);
  const { name } = cabin;

  return { title: `Cabin ${name}` };
}

//这个内置函数，可以fetch数据，然后提取每个cabin的id,最后nextjs就会提前知道这些id,对这些id的页面提前进行static 渲染
export async function generateStaticParams() {
  const cabins = await getCabins();

  const allCabinIds = cabins.map((cabin) => ({
    cabinId: String(cabin.id),
  }));

  return allCabinIds;
}

//这个params是每个路由或者布局都有路由的params，
export default async function Page({ params }) {
  console.log(params);

  const cabin = await getCabin(params.cabinId);

  return (
    <div className="max-w-6xl mx-auto mt-8">
      <Cabin cabin={cabin}></Cabin>

      <div>
        <h2 className="text-5xl font-semibold text-center mb-10 text-accent-400">
          Reserve {cabin.name} today. Pay on arrival.
        </h2>

        {/* 这里将日期选择和注册表格重新组件的原因是，
      如果都放在这个page页面，那么就要fetch3组数据，cabin，setting，和bookedDates
      那么势必会造成数据延迟，会导致整个页面都会被某组fetch数据的时候卡住
      如果把日期和注册表单独组件，那么他们读取数据的时候造成的延迟不会对这个代码上面的
      代码渲染造成block */}
        <Suspense fallback={<Spinner></Spinner>}>
          <Reservation cabin={cabin}></Reservation>
        </Suspense>
      </div>
    </div>
  );
}
