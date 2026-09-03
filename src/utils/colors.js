export const getSpeedColor = (speed) => {
    if (speed < 30) return '#8B5CF6'; // Purple
    if (speed < 60) return '#FCD34D'; // Yellow
    if (speed < 80) return '#FB923C'; // Orange
    return '#EF4444'; // Red
  };
  
  export const getFuelColor = (fuel) => {
    if (fuel <= 20) return '#EF4444'; // Red
    if (fuel <= 60) return '#FB923C'; // Orange
    return '#34D399'; // Green
  };
  
  export const getSpeedGradient = (speed) => {
    const colors = [
      { pos: 0, color: '#8B5CF6' },
      { pos: 30, color: '#8B5CF6' },
      { pos: 30.1, color: '#FCD34D' },
      { pos: 60, color: '#FCD34D' },
      { pos: 60.1, color: '#FB923C' },
      { pos: 80, color: '#FB923C' },
      { pos: 80.1, color: '#EF4444' },
      { pos: 100, color: '#EF4444' }
    ];
    return colors;
  };