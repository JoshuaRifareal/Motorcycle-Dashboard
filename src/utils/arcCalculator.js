export const calculateArc = (width, height) => {
    // Calculate arc that fits within container
    const padding = Math.min(width, height) * 0.05;
    const availableWidth = width - padding * 2;
    const availableHeight = height - padding * 2;
  
    // Arc spans 150 degrees (2.618 radians)
    const arcAngle = 2.618; // 150 degrees in radians
    
    // Calculate radius based on width
    const radius = availableWidth / (2 * Math.sin(arcAngle / 2));
    
    // Calculate arc height
    const arcHeight = radius * (1 - Math.cos(arcAngle / 2));
    
    // Adjust if arc height exceeds available height
    const isLandscape = width > height;
    const maxHeight = isLandscape ? availableHeight * 0.55 : availableHeight * 0.45;
    
    let finalRadius = radius;
    let finalHeight = arcHeight;
    
    if (arcHeight > maxHeight) {
      // Recalculate radius based on height constraint
      finalRadius = maxHeight / (1 - Math.cos(arcAngle / 2));
      finalHeight = maxHeight;
    }
  
    // Center position (bottom-center of the arc)
    const centerX = width / 2;
    const centerY = height / 2 + finalHeight * 0.4;
  
    // Calculate start and end angles (in radians)
    const startAngle = Math.PI + (Math.PI - arcAngle) / 2;
    const endAngle = Math.PI - (Math.PI - arcAngle) / 2;
  
    return {
      centerX,
      centerY,
      radius: finalRadius,
      arcHeight: finalHeight,
      startAngle: startAngle,
      endAngle: endAngle,
      arcAngle,
      isLandscape
    };
  };