"use client";
//因为在server component 下面，所有创建的文档默认为server，所以不能使用react也就是client side的组件
//如果需要在server component里面导入client component，就需要在最上面写‘use client’

import { useState } from "react";

export default function Counter({ user }) {
  const [count, setCounter] = useState(0);

  return (
    <div>
      <h4>
        There are {user.length} users, this data passed from server side
        compnent, cabins
      </h4>
      <button onClick={() => setCounter((num) => num + 1)}>{count}</button>
    </div>
  );
}
