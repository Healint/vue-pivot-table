<template>
  <div
    id="app"
    class="container mt-5">
    <h1 class="border-bottom pb-2 mb-4">
      Vue pivot table demo
    </h1>

    <h2 class="border-bottom pb-2 mb-4">
      Pivot <small>(drag & drop UI + PivotTable)</small>
    </h2>

    <div class="mb-5">
      <dynamic-pivot-table
        :data="asyncData"
        :fields="fields"
        :row-fields="rowFields"
        :col-fields="colFields"
        :reducer="reducer"
        :heatmap-mode="heatmapMode"
        :show-heatmap="showHeatmap"
        :default-show-settings="defaultShowSettings"
        :values-to-display="valuesToDisplay"
        :aggregation-logic="aggregationLogic"
        :aggregation-field="aggregationField">
        <template
          slot="value"
          slot-scope="{ value }">
          {{ value | number }}
        </template>
        <template
          slot="genderHeader"
          slot-scope="{ value }">
          <svg
            v-if="value == 'female'"
            aria-hidden="true"
            data-prefix="fas"
            data-icon="venus"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 288 512"
            class="svg-inline--fa fa-venus fa-fw">
            <path
              fill="currentColor"
              d="M288 176c0-79.5-64.5-144-144-144S0 96.5 0 176c0 68.5 47.9 125.9 112 140.4V368H76c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h36v36c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12v-36h36c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-36v-51.6c64.1-14.5 112-71.9 112-140.4zm-224 0c0-44.1 35.9-80 80-80s80 35.9 80 80-35.9 80-80 80-80-35.9-80-80z"
              class=""/>
          </svg>
          <svg
            v-else-if="value == 'male'"
            aria-hidden="true"
            data-prefix="fas"
            data-icon="mars"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="svg-inline--fa fa-mars fa-fw">
            <path
              fill="currentColor"
              d="M372 64h-79c-10.7 0-16 12.9-8.5 20.5l16.9 16.9-80.7 80.7c-22.2-14-48.5-22.1-76.7-22.1C64.5 160 0 224.5 0 304s64.5 144 144 144 144-64.5 144-144c0-28.2-8.1-54.5-22.1-76.7l80.7-80.7 16.9 16.9c7.6 7.6 20.5 2.2 20.5-8.5V76c0-6.6-5.4-12-12-12zM144 384c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"
              class=""/>
          </svg>
          {{ value | capitalize }}
        </template>
      </dynamic-pivot-table>
    </div>

    <h2 class="border-bottom pb-2 mb-4">
      PivotTable <small>(standalone)</small>
    </h2>

    <div class="mb-5">
      <static-pivot-table
        :data="asyncData"
        :row-fields="rowFields"
        :col-fields="colFields"
        :reducer="reducer"
        :heatmap-mode="heatmapMode"
        :show-heatmap="showHeatmap"
        :default-show-settings="defaultShowSettings"
        :is-data-loading="isDataLoading"
        :values-to-display="valuesToDisplay"
        :aggregation-logic="aggregationLogic"
        :aggregation-field="aggregationField">
        <template
          slot="value"
          slot-scope="{ value }">
          {{ value | number }}
        </template>
        <template
          slot="genderHeader"
          slot-scope="{ value }">
          <svg
            v-if="value == 'female'"
            aria-hidden="true"
            data-prefix="fas"
            data-icon="venus"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 288 512"
            class="svg-inline--fa fa-venus fa-fw">
            <path
              fill="currentColor"
              d="M288 176c0-79.5-64.5-144-144-144S0 96.5 0 176c0 68.5 47.9 125.9 112 140.4V368H76c-6.6 0-12 5.4-12 12v40c0 6.6 5.4 12 12 12h36v36c0 6.6 5.4 12 12 12h40c6.6 0 12-5.4 12-12v-36h36c6.6 0 12-5.4 12-12v-40c0-6.6-5.4-12-12-12h-36v-51.6c64.1-14.5 112-71.9 112-140.4zm-224 0c0-44.1 35.9-80 80-80s80 35.9 80 80-35.9 80-80 80-80-35.9-80-80z"
              class=""/>
          </svg>
          <svg
            v-else-if="value == 'male'"
            aria-hidden="true"
            data-prefix="fas"
            data-icon="mars"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 384 512"
            class="svg-inline--fa fa-mars fa-fw">
            <path
              fill="currentColor"
              d="M372 64h-79c-10.7 0-16 12.9-8.5 20.5l16.9 16.9-80.7 80.7c-22.2-14-48.5-22.1-76.7-22.1C64.5 160 0 224.5 0 304s64.5 144 144 144 144-64.5 144-144c0-28.2-8.1-54.5-22.1-76.7l80.7-80.7 16.9 16.9c7.6 7.6 20.5 2.2 20.5-8.5V76c0-6.6-5.4-12-12-12zM144 384c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"
              class=""/>
          </svg>
          {{ value | capitalize }}
        </template>
      </static-pivot-table>
    </div>
  </div>
</template>

<script>
import { DynamicPivotTable, StaticPivotTable } from '../src/browser'

const aggregationFieldName = 'Sample'

export default {
  name: 'App',
  components: {
    DynamicPivotTable,
    StaticPivotTable
  },
  data: () => {
    return {
      showHeatmap: true,
      heatmapMode: 'table',
      aggregationLogic: 'sum',
      aggregationField: aggregationFieldName,
      valuesToDisplay: 'raw-numbers-percentage-col-sum',
      asyncData: [],
      fields: [],
      rowFields: [],
      colFields: [],
      // reducer: (sum, item) => sum + 1,
      reducer: (sum, item) => {
        if (!Number.isNaN(Number(item[aggregationFieldName]))) {
          return sum + item[aggregationFieldName]
        } else {
          return 'No result'
        }
      },
      defaultShowSettings: true,
      isDataLoading: false
    }
  },
  created: function () {
    this.isDataLoading = true

    fetch(
      'http://0.0.0.0:8888',
      {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {
          Accept: 'application/json'
        }
      }
    )
      .then(response => response.json())
      .then(data => {
        return new Promise(resolve => {
          this.asyncData = Object.freeze(data)
          resolve()
        })
      })
      .then(() => {
        this.isDataLoading = false
        this.fields = this.createFields(Object.keys(this.asyncData[0]))
      })
  },
  filters: {
    number: function (value) {
      return value.toLocaleString()
    },
    capitalize: function (value) {
      return value.replace(/\b\w/g, l => l.toUpperCase())
    }
  },
  methods: {
    createFields (dataKeys) {
      return dataKeys.map(dataKey => {
        return {
          getter: item => item[dataKey],
          label: dataKey
        }
      })
    }
  }
}
</script>

<style lang="scss">
$enable-rounded: true;
@import '~bootstrap/scss/bootstrap.scss';

/* FontAwesome icons */
.svg-inline--fa.fa-fw {
  width: 1.25em;
}

.svg-inline--fa {
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -.125em !important;
}

.fa-pulse {
  animation: fa-spin 1s infinite steps(8);
}

@keyframes fa-spin {
  0% {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(1turn);
  }
}
</style>
