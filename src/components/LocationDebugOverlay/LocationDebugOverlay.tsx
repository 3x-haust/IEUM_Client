import { useEffect, useMemo, useState } from 'react';
import { readCompassHeading, toMapHeading } from '@/utils/locationMapping';
import * as S from './LocationDebugOverlay.styled';

type LocationSample = {
  readonly latitude: number;
  readonly longitude: number;
  readonly accuracy: number;
  readonly heading: number | null;
  readonly speed: number | null;
  readonly timestamp: number;
};

type DeviceOrientationPermission = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

function formatNumber(value: number, digits: number): string {
  return value.toFixed(digits);
}

function formatNullable(value: number | null, digits: number, suffix = ''): string {
  return value === null ? '-' : `${formatNumber(value, digits)}${suffix}`;
}

function getOrientationPermission(): DeviceOrientationPermission | null {
  if (typeof DeviceOrientationEvent === 'undefined') return null;
  return DeviceOrientationEvent as DeviceOrientationPermission;
}

function LocationDebugOverlay() {
  const [sample, setSample] = useState<LocationSample | null>(null);
  const [compassHeading, setCompassHeading] = useState<number | null>(null);
  const [message, setMessage] = useState('현재 위치를 불러오는 중');
  const isGeolocationSupported = typeof navigator !== 'undefined' && Boolean(navigator.geolocation);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setSample({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          heading: position.coords.heading,
          speed: position.coords.speed,
          timestamp: position.timestamp,
        });
        setMessage('좌표 측정 중');
      },
      (error) => {
        setMessage(`${error.code}: ${error.message}`);
      },
      { enableHighAccuracy: true, maximumAge: 1000, timeout: 15000 },
    );
    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  useEffect(() => {
    const onOrientation = (event: DeviceOrientationEvent) => {
      setCompassHeading(readCompassHeading(event));
    };
    window.addEventListener('deviceorientation', onOrientation, true);
    window.addEventListener('deviceorientationabsolute', onOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', onOrientation, true);
      window.removeEventListener('deviceorientationabsolute', onOrientation, true);
    };
  }, []);

  const coordinateText = useMemo(() => {
    if (!sample) return '';
    const rawHeading = compassHeading ?? sample.heading;
    const mapHeading = toMapHeading(rawHeading);
    return [
      `lat=${formatNumber(sample.latitude, 7)}`,
      `lng=${formatNumber(sample.longitude, 7)}`,
      `accuracy=${formatNumber(sample.accuracy, 1)}m`,
      `heading=${formatNullable(rawHeading, 1, 'deg')}`,
      `mapHeading=${formatNullable(mapHeading, 1, 'deg')}`,
    ].join(', ');
  }, [compassHeading, sample]);

  const requestDirectionPermission = async () => {
    const orientation = getOrientationPermission();
    if (!orientation?.requestPermission) {
      setMessage('방향 권한 요청이 필요 없는 브라우저');
      return;
    }
    const result = await orientation.requestPermission();
    setMessage(result === 'granted' ? '방향 권한 허용됨' : '방향 권한 거부됨');
  };

  const copyCoordinate = async () => {
    if (!coordinateText) return;
    await navigator.clipboard?.writeText(coordinateText);
    setMessage('좌표 복사됨');
  };

  const rawHeading = compassHeading ?? sample?.heading ?? null;
  const mapHeading = toMapHeading(rawHeading);

  return (
    <S.Panel>
      <S.Header>
        <S.Title>위치 디버그</S.Title>
        <S.Button type="button" onClick={copyCoordinate} disabled={!coordinateText}>
          복사
        </S.Button>
      </S.Header>
      <S.Grid>
        <S.Term>위도</S.Term>
        <S.Value>{sample ? formatNumber(sample.latitude, 7) : '-'}</S.Value>
        <S.Term>경도</S.Term>
        <S.Value>{sample ? formatNumber(sample.longitude, 7) : '-'}</S.Value>
        <S.Term>정확도</S.Term>
        <S.Value>{sample ? `${formatNumber(sample.accuracy, 1)}m` : '-'}</S.Value>
        <S.Term>방향</S.Term>
        <S.Value>{formatNullable(rawHeading, 1, 'deg')}</S.Value>
        <S.Term>지도 방향</S.Term>
        <S.Value>{formatNullable(mapHeading, 1, 'deg')}</S.Value>
        <S.Term>속도</S.Term>
        <S.Value>{formatNullable(sample?.speed ?? null, 2, 'm/s')}</S.Value>
      </S.Grid>
      <S.Message>{isGeolocationSupported ? message : '이 브라우저는 위치 정보를 지원하지 않음'}</S.Message>
      <S.Button type="button" onClick={requestDirectionPermission}>
        방향 권한 요청
      </S.Button>
    </S.Panel>
  );
}

export default LocationDebugOverlay;
