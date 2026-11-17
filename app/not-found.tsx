import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <p className="eyebrow">404</p>
      <h1>That page does not exist</h1>
      <p className="lede">Check the address, or go back to the course map.</p>
      <div className="row" style={{ marginTop: 20 }}>
        <Link href="/units" className="btn btn-primary">
          Go to units
        </Link>
      </div>
    </>
  );
}
