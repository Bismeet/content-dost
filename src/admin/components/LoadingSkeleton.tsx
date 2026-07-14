import React from 'react';

interface SkeletonProps {
  style?: React.CSSProperties;
}

const ShimmerElement: React.FC<SkeletonProps> = ({ style }) => {
  return (
    <div
      className="admin-skeleton"
      style={{
        borderRadius: '4px',
        height: '16px',
        width: '100%',
        ...style,
      }}
    />
  );
};

export const StatsSkeleton: React.FC = () => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '12px',
        marginBottom: '16px',
      }}
    >
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          style={{
            backgroundColor: '#0d0f0c',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '6px',
            padding: '12px 16px',
          }}
        >
          <ShimmerElement style={{ width: '60%', height: '12px', marginBottom: '8px' }} />
          <ShimmerElement style={{ width: '40%', height: '24px', marginBottom: '6px' }} />
          <ShimmerElement style={{ width: '80%', height: '10px' }} />
        </div>
      ))}
    </div>
  );
};

export const TableSkeleton: React.FC = () => {
  return (
    <div
      style={{
        backgroundColor: '#0d0f0c',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '6px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          height: '40px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: 'rgba(255, 255, 255, 0.02)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 16px',
        }}
      >
        <ShimmerElement style={{ width: '100%' }} />
      </div>
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          style={{
            height: '48px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
            display: 'grid',
            gridTemplateColumns: '1.2fr 1.5fr 2fr 1.2fr 1.5fr 1fr 1fr',
            alignItems: 'center',
            gap: '16px',
            padding: '0 16px',
          }}
        >
          <ShimmerElement style={{ width: '80%' }} />
          <ShimmerElement style={{ width: '90%' }} />
          <ShimmerElement style={{ width: '95%' }} />
          <ShimmerElement style={{ width: '#70%' }} />
          <ShimmerElement style={{ width: '#80%' }} />
          <ShimmerElement style={{ width: '60%', height: '18px', borderRadius: '12px' }} />
          <ShimmerElement style={{ width: '40%' }} />
        </div>
      ))}
    </div>
  );
};

export const DrawerSkeleton: React.FC = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '16px 0' }}>
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <ShimmerElement style={{ width: '30%', height: '10px', marginBottom: '8px' }} />
          <ShimmerElement style={{ width: '90%', height: '14px', marginBottom: '6px' }} />
          <ShimmerElement style={{ width: '60%', height: '14px' }} />
        </div>
      ))}
    </div>
  );
};
