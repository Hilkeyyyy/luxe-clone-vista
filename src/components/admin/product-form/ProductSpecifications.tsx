
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface WatchSpecifications {
  modelo?: string;
  linha?: string;
  referencia?: string;
  formato_caixa?: string;
  espessura?: string;
  cor_caixa?: string;
  acabamento_caixa?: string;
  tipo_vidro?: string;
  cor_mostrador?: string;
  tipo_indices?: string;
  subdials?: string;
  data?: string;
  gmt?: string;
  tipo_pulseira?: string;
  material_pulseira?: string;
  cor_pulseira?: string;
  tipo_fecho?: string;
  comprimento_pulseira?: string;
  calibre?: string;
  frequencia?: string;
  reserva_marcha?: string;
  joias?: string;
  certificacao_movimento?: string;
  cronografo?: string;
  alarme?: string;
  bussola?: string;
  calculadora?: string;
  taquimetro?: string;
  telemetro?: string;
  choque?: string;
  magnetismo?: string;
  temperatura?: string;
  cosc?: string;
  teste_marca?: string;
  garantia?: string;
}

interface ProductSpecificationsProps {
  movement?: string;
  diameter?: string;
  material?: string;
  water_resistance?: string;
  specifications?: WatchSpecifications;
  onUpdate: (field: string, value: string) => void;
  onSpecificationUpdate: (key: keyof WatchSpecifications, value: string) => void;
}

const ProductSpecifications: React.FC<ProductSpecificationsProps> = ({
  movement,
  diameter,
  material,
  water_resistance,
  specifications,
  onUpdate,
  onSpecificationUpdate
}) => {
  const [specsOpen, setSpecsOpen] = useState(false);

  return (
    <>
      {/* Especificações Técnicas Básicas */}
      <Card>
        <CardHeader>
          <CardTitle>Especificações Técnicas Básicas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="movement">Movimento</Label>
            <Input
              id="movement"
              placeholder="Ex: Automático, Quartzo..."
              value={movement}
              onChange={(e) => onUpdate('movement', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="diameter">Diâmetro</Label>
            <Input
              id="diameter"
              placeholder="Ex: 40mm, 42mm..."
              value={diameter}
              onChange={(e) => onUpdate('diameter', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="material">Material</Label>
            <Input
              id="material"
              placeholder="Ex: Aço Inoxidável, Ouro..."
              value={material}
              onChange={(e) => onUpdate('material', e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="water_resistance">Resistência à Água</Label>
            <Input
              id="water_resistance"
              placeholder="Ex: 30m, 100m, 300m..."
              value={water_resistance}
              onChange={(e) => onUpdate('water_resistance', e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Especificações Avançadas - Collapsible */}
      <Card>
        <Collapsible open={specsOpen} onOpenChange={setSpecsOpen}>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-neutral-50">
              <div className="flex items-center justify-between">
                <CardTitle>Especificações Avançadas (Opcional)</CardTitle>
                {specsOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              {/* Informações do Modelo */}
              <div>
                <h4 className="font-semibold mb-3">Informações do Modelo</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Modelo</Label>
                    <Input
                      placeholder="Ex: Submariner, Speedmaster..."
                      value={specifications?.modelo || ''}
                      onChange={(e) => onSpecificationUpdate('modelo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Linha</Label>
                    <Input
                      placeholder="Ex: Professional, GMT-Master..."
                      value={specifications?.linha || ''}
                      onChange={(e) => onSpecificationUpdate('linha', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Referência</Label>
                    <Input
                      placeholder="Ex: 116610LN, 311.30.42.30..."
                      value={specifications?.referencia || ''}
                      onChange={(e) => onSpecificationUpdate('referencia', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Especificações da Caixa */}
              <div>
                <h4 className="font-semibold mb-3">Caixa</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Formato da Caixa</Label>
                    <Input
                      placeholder="Ex: Redonda, Quadrada, Retangular..."
                      value={specifications?.formato_caixa || ''}
                      onChange={(e) => onSpecificationUpdate('formato_caixa', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Espessura</Label>
                    <Input
                      placeholder="Ex: 12mm, 15mm..."
                      value={specifications?.espessura || ''}
                      onChange={(e) => onSpecificationUpdate('espessura', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Cor da Caixa</Label>
                    <Input
                      placeholder="Ex: Prata, Dourada, Preta..."
                      value={specifications?.cor_caixa || ''}
                      onChange={(e) => onSpecificationUpdate('cor_caixa', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Acabamento da Caixa</Label>
                    <Input
                      placeholder="Ex: Polido, Escovado, PVD..."
                      value={specifications?.acabamento_caixa || ''}
                      onChange={(e) => onSpecificationUpdate('acabamento_caixa', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tipo de Vidro</Label>
                    <Input
                      placeholder="Ex: Safira, Mineral, Acrílico..."
                      value={specifications?.tipo_vidro || ''}
                      onChange={(e) => onSpecificationUpdate('tipo_vidro', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Especificações do Mostrador */}
              <div>
                <h4 className="font-semibold mb-3">Mostrador</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Cor do Mostrador</Label>
                    <Input
                      placeholder="Ex: Preto, Branco, Azul..."
                      value={specifications?.cor_mostrador || ''}
                      onChange={(e) => onSpecificationUpdate('cor_mostrador', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tipo de Índices</Label>
                    <Input
                      placeholder="Ex: Aplicados, Impressos, Luminosos..."
                      value={specifications?.tipo_indices || ''}
                      onChange={(e) => onSpecificationUpdate('tipo_indices', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Subdials</Label>
                    <Input
                      placeholder="Ex: 3 subdials, Cronógrafo..."
                      value={specifications?.subdials || ''}
                      onChange={(e) => onSpecificationUpdate('subdials', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Exibição de Data</Label>
                    <Input
                      placeholder="Ex: 3h, 6h, Sem data..."
                      value={specifications?.data || ''}
                      onChange={(e) => onSpecificationUpdate('data', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>GMT</Label>
                    <Input
                      placeholder="Ex: Ponteiro GMT, Bezel GMT..."
                      value={specifications?.gmt || ''}
                      onChange={(e) => onSpecificationUpdate('gmt', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Pulseira/Correia */}
              <div>
                <h4 className="font-semibold mb-3">Pulseira/Correia</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Tipo</Label>
                    <Input
                      placeholder="Ex: Pulseira, Correia..."
                      value={specifications?.tipo_pulseira || ''}
                      onChange={(e) => onSpecificationUpdate('tipo_pulseira', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Material da Pulseira</Label>
                    <Input
                      placeholder="Ex: Aço, Couro, Borracha..."
                      value={specifications?.material_pulseira || ''}
                      onChange={(e) => onSpecificationUpdate('material_pulseira', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Cor da Pulseira</Label>
                    <Input
                      placeholder="Ex: Prata, Marrom, Preta..."
                      value={specifications?.cor_pulseira || ''}
                      onChange={(e) => onSpecificationUpdate('cor_pulseira', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Tipo de Fecho</Label>
                    <Input
                      placeholder="Ex: Fivela, Deployant, Oysterlock..."
                      value={specifications?.tipo_fecho || ''}
                      onChange={(e) => onSpecificationUpdate('tipo_fecho', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Comprimento</Label>
                    <Input
                      placeholder="Ex: 18-22cm, Ajustável..."
                      value={specifications?.comprimento_pulseira || ''}
                      onChange={(e) => onSpecificationUpdate('comprimento_pulseira', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Movimento Detalhado */}
              <div>
                <h4 className="font-semibold mb-3">Movimento Detalhado</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Calibre</Label>
                    <Input
                      placeholder="Ex: 2824-2, 7750, Miyota 9015..."
                      value={specifications?.calibre || ''}
                      onChange={(e) => onSpecificationUpdate('calibre', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Frequência</Label>
                    <Input
                      placeholder="Ex: 28.800 vph, 21.600 vph..."
                      value={specifications?.frequencia || ''}
                      onChange={(e) => onSpecificationUpdate('frequencia', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Reserva de Marcha</Label>
                    <Input
                      placeholder="Ex: 42h, 72h, 120h..."
                      value={specifications?.reserva_marcha || ''}
                      onChange={(e) => onSpecificationUpdate('reserva_marcha', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Joias</Label>
                    <Input
                      placeholder="Ex: 25 joias, 31 joias..."
                      value={specifications?.joias || ''}
                      onChange={(e) => onSpecificationUpdate('joias', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Certificação do Movimento</Label>
                    <Input
                      placeholder="Ex: COSC, Manufatura..."
                      value={specifications?.certificacao_movimento || ''}
                      onChange={(e) => onSpecificationUpdate('certificacao_movimento', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Funções Especiais */}
              <div>
                <h4 className="font-semibold mb-3">Funções Especiais</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Cronógrafo</Label>
                    <Input
                      placeholder="Ex: 1/10s, 30 min, 12h..."
                      value={specifications?.cronografo || ''}
                      onChange={(e) => onSpecificationUpdate('cronografo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Alarme</Label>
                    <Input
                      placeholder="Ex: Alarme simples, Dual time..."
                      value={specifications?.alarme || ''}
                      onChange={(e) => onSpecificationUpdate('alarme', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Bússola</Label>
                    <Input
                      placeholder="Ex: Digital, Analógica..."
                      value={specifications?.bussola || ''}
                      onChange={(e) => onSpecificationUpdate('bussola', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Calculadora</Label>
                    <Input
                      placeholder="Ex: Régua de cálculo, Digital..."
                      value={specifications?.calculadora || ''}
                      onChange={(e) => onSpecificationUpdate('calculadora', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Taquímetro</Label>
                    <Input
                      placeholder="Ex: Escala 400, Bezel externo..."
                      value={specifications?.taquimetro || ''}
                      onChange={(e) => onSpecificationUpdate('taquimetro', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Telémetro</Label>
                    <Input
                      placeholder="Ex: Escala 1000m, Interno..."
                      value={specifications?.telemetro || ''}
                      onChange={(e) => onSpecificationUpdate('telemetro', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Resistências */}
              <div>
                <h4 className="font-semibold mb-3">Resistências</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Resistência a Choques</Label>
                    <Input
                      placeholder="Ex: ISO 1413, Militar..."
                      value={specifications?.choque || ''}
                      onChange={(e) => onSpecificationUpdate('choque', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Resistência Magnética</Label>
                    <Input
                      placeholder="Ex: 4.800 A/m, Antimagnético..."
                      value={specifications?.magnetismo || ''}
                      onChange={(e) => onSpecificationUpdate('magnetismo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Resistência à Temperatura</Label>
                    <Input
                      placeholder="Ex: -10°C a +60°C..."
                      value={specifications?.temperatura || ''}
                      onChange={(e) => onSpecificationUpdate('temperatura', e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Certificações e Garantia */}
              <div>
                <h4 className="font-semibold mb-3">Certificações e Garantia</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Certificação COSC</Label>
                    <Input
                      placeholder="Ex: Sim, Não, Cronômetro..."
                      value={specifications?.cosc || ''}
                      onChange={(e) => onSpecificationUpdate('cosc', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Teste da Marca</Label>
                    <Input
                      placeholder="Ex: Master Chronometer, Superlative..."
                      value={specifications?.teste_marca || ''}
                      onChange={(e) => onSpecificationUpdate('teste_marca', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Garantia</Label>
                    <Input
                      placeholder="Ex: 2 anos, 5 anos..."
                      value={specifications?.garantia || ''}
                      onChange={(e) => onSpecificationUpdate('garantia', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </>
  );
};

export default ProductSpecifications;
