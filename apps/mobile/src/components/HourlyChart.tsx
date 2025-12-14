import React from 'react';
import {View, Text, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {getOccupancyColor} from '../utils/parkingUtils';
import { COLORS, Shadow } from '../constants/theme';

interface HourData {
  time: string;
  occupancy: number;
  lowerBound?: number;
  upperBound?: number;
}

interface HourlyChartProps {
  data: HourData[];
}

export function HourlyChart({data}: HourlyChartProps) {
  // Compute chart dimensions
  const chartWidth = Dimensions.get('window').width - 48;
  const chartHeight = 280;
  const barWidth = Math.max(10, (chartWidth - 40) / data.length - 2);
  const maxHeight = chartHeight - 40;

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.chartTitle}>Hourly Occupancy Forecast</Text>
      
      <View style={styles.chart}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.yAxisLabel}>100</Text>
          <Text style={styles.yAxisLabel}>75</Text>
          <Text style={styles.yAxisLabel}>50</Text>
          <Text style={styles.yAxisLabel}>25</Text>
          <Text style={styles.yAxisLabel}>0</Text>
        </View>

        {/* Chart area */}
        <View style={{ flex: 1 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={true}>
              <View style={{ 
                width: Math.max(chartWidth - 40, barWidth * data.length + 20), 
                height: chartHeight 
              }}>

              {/* Bars */}
              <View style={[styles.barsContainer, { height: maxHeight }]}>
                {data.map((item, index) => {
                  const barHeight = (item.occupancy / 100) * maxHeight;

                  return (
                    <View key={index} style={[styles.barWrapper, { width: barWidth + 2 }]}>
                      {/* Bar */}
                      <View style={[styles.bar, {
                        height: barHeight,
                        backgroundColor: getOccupancyColor(item.occupancy),
                        bottom: 0,
                      }]} />
                      
                      {/* X-axis label */}
                      {index % 3 === 0 && (<Text style={styles.xAxisLabel}>{item.time}</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartContainer: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    ...Shadow.lg,
  },
  chartTitle: {
    fontSize: 16,
    color:  COLORS.text,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    height: 280,
  },

  // y-axis
  yAxis: {
    width: 30,
    justifyContent: 'space-between',
    marginRight: 10,
    height: 240,
  },
  yAxisLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'right',
  },
    
  // Bar
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    position: 'relative',
  },
  barWrapper: {
    alignItems: 'center',
    height: '100%',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  bar: {
    position: 'absolute',
    width: '80%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  
  // X-axis
  xAxisLabel: {
    position: 'absolute',
    bottom: -25,
    fontSize: 10,
    color: COLORS.textSecondary,
  },
});