interface Props {
  tamanho?: number;
  className?: string;
}

// pontos do contorno (os "chumbos" da tarrafa)
const PONTOS = Array.from({ length: 36 }, (_, i) => {
  const angulo = (i * 10 * Math.PI) / 180;
  return { x: 100 + 93 * Math.cos(angulo), y: 100 + 93 * Math.sin(angulo) };
});

// raios da malha
const RAIOS = Array.from({ length: 12 }, (_, i) => {
  const angulo = ((i * 30 + 15) * Math.PI) / 180;
  return {
    x1: 100 + 28 * Math.cos(angulo),
    y1: 100 + 28 * Math.sin(angulo),
    x2: 100 + 78 * Math.cos(angulo),
    y2: 100 + 78 * Math.sin(angulo),
  };
});

export default function LogoTarrafa({ tamanho = 48, className }: Props) {
  return (
    <svg
      viewBox="0 0 200 200"
      width={tamanho}
      height={tamanho}
      className={className}
      role="img"
      aria-label="Símbolo do Tarrafa"
    >
      {PONTOS.map((ponto, i) => (
        <circle key={i} cx={ponto.x} cy={ponto.y} r={2.2} fill="currentColor" />
      ))}

      <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="2" />
      {[60, 44, 28].map((raio) => (
        <circle
          key={raio}
          cx="100"
          cy="100"
          r={raio}
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}

      {RAIOS.map((linha, i) => (
        <line
          key={i}
          x1={linha.x1}
          y1={linha.y1}
          x2={linha.x2}
          y2={linha.y2}
          stroke="currentColor"
          strokeWidth="1"
        />
      ))}

      {/* o peixe no centro */}
      <ellipse cx="96" cy="100" rx="17" ry="8.5" fill="currentColor" />
      <path d="M110 100 L126 89 L126 111 Z" fill="currentColor" />
      <circle cx="87" cy="98" r="1.8" style={{ fill: "var(--verde-mare)" }} />
    </svg>
  );
}
