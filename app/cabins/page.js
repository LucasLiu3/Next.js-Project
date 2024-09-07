import { Suspense } from "react";

import CabinList from "../_components/CabinList";

import Spinner from "../_components/Spinner";
import Filter from "../_components/Filter";
import ReservationReminder from "../_components/ReservationReminder";

export const metadata = {
  title: "Cabins",
};

//因为next.js产生的static网站，所以当cabin这个路由页面产生的时候，后代fetch的data也会被存储
//如果不设定这个revalidate的值，数据库里的数据更改，页面不会进行实时更新的
//这个是在route路由下，在components下是另外一个写法，具体看CabinList.js里面的写法
//当然，这个要在production环境里，在development阶段，不需要
export const revalidate = 60;

//在路由里面有?***** 的条件，但是因为这里是page，不能使用react的useSearchParams组件
//只能在page层面使用 自动传递的searchParams pros， 还有另外一个是params，就是cabins/：cabinId,这个会显示：cabinId号
export default function Page({ searchParams }) {
  console.log(searchParams);

  const filter = searchParams?.capacity ?? "all";

  return (
    <div>
      <h1 className="text-4xl mb-5 text-accent-400 font-medium">
        Our Luxury Cabins
      </h1>
      <p className="text-primary-200 text-lg mb-10">
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature's beauty in your own little home
        away from home. The perfect spot for a peaceful, calm vacation. Welcome
        to paradise.
      </p>

      <div className="flex justify-end mb-8">
        <Filter></Filter>
      </div>

      {/* 利用suspense组件，如果下面的组件里的数据fetching耗时慢，就会显示fallback里面的组件，那么对于页面中其他不需要fetch的内容就可以直接显示，不用整个页面等待渲染 */}
      {/* 给suspense一个key,当key改变的时候，suspense组件还会继续起作用，防止同一个路由里面，因为地址后面？的内容变化，路由内容变化，suspense不发挥作用 */}
      <Suspense fallback={<Spinner></Spinner>} key={filter}>
        <CabinList filter={filter} />
        <ReservationReminder></ReservationReminder>
      </Suspense>
    </div>
  );
}
