import { useEffect, useState, type JSX } from 'react';
import Spinner from '../ui/Spinner';
import SectionTitle from '../ui/SectionTitle';

interface Charger {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  oldPrice: number;
  price: number;
}

export default function ChargersSection(): JSX.Element {
  const [chargers, setChargers] = useState<Charger[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/chargers`)
      .then(res => res.json())
      .then((data: Charger[]) => {
        setChargers(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Spinner />;
  }

  return (
    <section className="py-16 bg-wh-100">
      <div className="max-w-[161.25rem] mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {chargers.map(ch => (
            <div key={ch._id} className="space-y-4">
              <div className="overflow-hidden">
                <img
                  src={`/src/assets/chargers/${ch.imageUrl}`}
                  alt={ch.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-[24px] font-semibold text-primary">
                {ch.title}
              </h3>
              <p className="text-grey-100 text-sm">
                {ch.description}
              </p>
              <div className="mt-2">
                <span className="text-grey-100 mr-2 text-[24px]">
                  ${ch.oldPrice.toLocaleString()}
                </span>
                <span className="text-primary font-bold text-[24px]">
                  ${ch.price.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
