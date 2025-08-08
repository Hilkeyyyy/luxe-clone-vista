import React, { useEffect, useState } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { supabase } from '@/integrations/supabase/client';

const title = 'ÚLTIMOS POSTERS DO INSTAGRAM';

const InstagramCarousel: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from('admin_settings')
        .select('setting_value')
        .eq('setting_key', 'instagram_images')
        .single();
      const list = Array.isArray(data?.setting_value) ? data?.setting_value as string[] : [];
      setImages(list);
    };
    load();
  }, []);

  if (!images.length) return null;

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-foreground mb-8 text-center">
          {title}
        </h2>
        <Carousel opts={{ loop: true }}>
          <CarouselContent>
            {images.map((src, idx) => (
              <CarouselItem key={idx} className="md:basis-1/3 lg:basis-1/4">
                <div className="aspect-square overflow-hidden rounded-lg border">
                  <img src={src} alt={`Instagram post ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="bg-background/80" />
          <CarouselNext className="bg-background/80" />
        </Carousel>
      </div>
    </section>
  );
};

export default InstagramCarousel;
