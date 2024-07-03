import Link from "next/link";

const Url = (props) => {
  return (
    <tr className="bg-[#F4EEE0] border-b text-[#393646]">
      <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap d">
        {"http://localhost:3000/" + props.shortId}
      </th>
      <td className="px-6 py-4">{props.redirectUrl}</td>
      <td className="px-6 py-4"><Link href={`/url/${props.id}`}>Details</Link></td>
    </tr>
  );
};

export default Url;
