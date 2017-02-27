import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  View,
} from 'react-native';

import reactAddonsUpdate from 'immutability-helper';

import { LineChart } from 'react-native-mp-android-chart';

class LineChartScreen extends React.Component {

    constructor(props) {
        super();

        this.state = {
            data: {},
            legend: {
                enabled: true,
                textColor: 'blue',
                textSize: 12,
                position: 'BELOW_CHART_RIGHT',
                form: 'SQUARE',
                formSize: 14,
                xEntrySpace: 10,
                yEntrySpace: 5,
                formToTextSpace: 5,
                wordWrapEnabled: true,
                maxSizePercent: 0.5,
                fontFamily: 'monospace',
                fontStyle: 1,
                custom: {
                    colors: ['red', 'blue', 'green'],
                    labels: ['Massa'],
                },
            },
            marker: {
                enabled: false,
                type: 'oval',
                backgroundTint: 'teal',
            },
        };
    }

    componentDidMount() {
        this.setState(
            reactAddonsUpdate(this.state, {
                data: {
                    $set: {
                        datasets: [
                            {
                                yValues: this.props.weightmeasurements,
                                label: 'Massa',
                                config: {
                                    lineWidth: 1,
                                    drawCubic: true,
                                    drawCubicIntensity: 0.4,
                                    circleRadius: 0,
                                    drawHighlightIndicators: false,
                                    color: 'blue',
                                    drawFilled: true,
                                    fillColor: 'blue',
                                    fillAlpha: 45,
                                    circleColor: 'blue',
                                },
                            },
                        ],
                        xValues: this.props.dates,
                    },
                },
            }),
        );
    }

    render() {
        return (
            <View style={styles.container}>
                <LineChart
                    style={styles.chart}
                    data={this.state.data}
                    description={{ text: '' } }
                    legend={this.state.legend}
                    marker={this.state.marker}

                    drawGridBackground={false}
                    borderColor={'teal'}
                    borderWidth={1}
                    drawBorders={true}

                    touchEnabled={true}
                    dragEnabled={true}
                    scaleEnabled={true}
                    scaleXEnabled={true}
                    scaleYEnabled={true}
                    pinchZoom={true}
                    doubleTapToZoomEnabled={true}

                    dragDecelerationEnabled={true}
                    dragDecelerationFrictionCoef={0.99}

                    keepPositionOnRotation={false}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    chart: {
        flex: 1,
    },
});

AppRegistry.registerComponent('LineChartScreen', () => LineChartScreen);

export default LineChartScreen;
