<template>
  <div class="table-responsive">
    <table class="table table-bordered">
      <!-- Table header -->
      <thead>
        <tr v-for="(colField, colFieldIndex) in colFields" :key="colField.key">
          <!-- Top left dead cell -->
          <th v-if="colFieldIndex === 0 && rowFields.length > 0" :colspan="rowFields.length" :rowspan="colFields.length"></th>
          <!-- Column headers -->
          <!-- NOTE: Customization -->
          <template v-for="(col, colIndex) in cols">
            <th v-if="spanSize(cols, colFieldIndex, colIndex) !== 0" :key="JSON.stringify(col)" :colspan="spanSize(cols, colFieldIndex, colIndex)">
              <slot v-if="colField.headerSlotName" :name="colField.headerSlotName" v-bind:value="col[colFieldIndex]">
                Missing slot <code>{{ colField.headerSlotName }}</code>
              </slot>
              <template v-else>
                {{ col[colFieldIndex] }}
              </template>
            </th>
          </template>
          <!-- Top right cell -->
          <!-- NOTE: Customization -->
          <template v-if="colFieldIndex === 0 && colFields.length > 0">
            <template v-if="aggregationLogic === 'raw-numbers'">
              <td v-if="valuesToDisplay !== 'percentage-col-sum'" :rowspan="colFields.length" class="summation">Row {{ aggregationLogic | capitalize }}<sup v-if="valuesToDisplay !== 'raw-numbers'">*</sup></td>
              <td v-else-if="valuesToDisplay === 'percentage-col-sum'" :rowspan="colFields.length" class="summation">Row Mean<sup v-if="valuesToDisplay !== 'raw-numbers'">*</sup></td>
            </template>
            <template v-else>
              <td :rowspan="colFields.length" class="summation">Row {{ aggregationLogic | capitalize }}</td>
            </template>
          </template>
        </tr>
      </thead>
      <!-- Table body -->
      <tbody>
        <tr v-for="(row, rowIndex) in rows" :key="JSON.stringify(row)">
          <!-- Row headers -->
          <!-- NOTE: Customization -->
          <template v-for="(rowField, rowFieldIndex) in rowFields">
            <td v-if="spanSize(rows, rowFieldIndex, rowIndex) !== 0" :key="rowField.key" :rowspan="spanSize(rows, rowFieldIndex, rowIndex)" class="font-weight-bold">
              <slot v-if="rowField.headerSlotName" :name="rowField.headerSlotName" v-bind:value="row[rowFieldIndex]">
                  Missing slot <code>{{ rowField.headerSlotName }}</code>
              </slot>
              <template v-else>
                {{ row[rowFieldIndex] }}
              </template>
            </td>
          </template>
          <!-- Values -->
          <td v-for="col in cols" :key="JSON.stringify(col)" class="text-right">
            <!-- NOTE: Customization -->
            <template v-if="aggregationLogic === 'count'">
              <slot v-if="$scopedSlots.value && valuesToDisplay === 'raw-numbers'" name="value" v-bind:value="displayedValues[JSON.stringify({ col, row })]" />
              <slot v-else-if="$scopedSlots.value && valuesToDisplay !== 'raw-numbers'" name="value" v-bind:value="`${displayedValues[JSON.stringify({ col, row })].toFixed(1)}%`" />
            </template>
            <template v-else>{{ displayedValues[JSON.stringify({ col, row })].toLocaleString() }}</template>
          </td>
          <!-- NOTE: Customization -->
          <!-- Row footers (if slots are provided) -->
          <template v-if="colFields.length > 0">
            <template v-if="aggregationLogic === 'count'">
              <td v-if="valuesToDisplay === 'raw-numbers'" class="summation">{{ rowAggregates[rowIndex].toLocaleString() }}</td>
              <td v-else-if="valuesToDisplay === 'percentage-col-sum'" class="summation">{{ computeMean('row', rowIndex).toLocaleString() }}%</td>
              <td v-else-if="valuesToDisplay === 'percentage-row-sum'" class="summation">100%</td>
            </template>
            <template v-else>
              <td class="summation">{{ rowAggregates[rowIndex].toLocaleString() }}</td>
            </template>
          </template>
        </tr>
      </tbody>
      <!-- NOTE: Customization -->
      <!-- Table footer -->
      <tfoot v-if="rowFields.length > 0">
        <tr>
          <!-- Bottom left cell -->
          <template v-if="aggregationLogic === 'count'">
            <td v-if="valuesToDisplay !== 'percentage-row-sum'" :colspan="rowFields.length" class="summation">Column {{ aggregationLogic | capitalize }}<sup v-if="valuesToDisplay !== 'raw-numbers'">*</sup></td>
            <td v-else-if="valuesToDisplay === 'percentage-row-sum'" :colspan="rowFields.length" class="summation">Column Mean<sup v-if="valuesToDisplay !== 'raw-numbers'">*</sup></td>
          </template>
          <template v-else>
            <td :colspan="rowFields.length" class="summation">Column {{ aggregationLogic | capitalize }}</td>
          </template>
          <!-- Column footers -->
          <td v-for="(colSum, index) in colAggregates" :key="`col-sum-${index}`" class="summation">
            <template v-if="aggregationLogic === 'count'">
              <template v-if="valuesToDisplay === 'raw-numbers'">{{  colSum.toLocaleString() }}</template>
              <template v-else-if="valuesToDisplay === 'percentage-col-sum'">100%</template>
              <template v-else-if="valuesToDisplay === 'percentage-row-sum'">{{ computeMean('col', index).toLocaleString() }}%</template>
            </template>
            <template v-else>
              <template>{{colSum.toLocaleString() }}</template>
            </template>
          </td>
          <!-- Bottom right dead cell -->
          <td v-if="colFields.length > 0" class="summation" style="border-left: 2px solid #dee2e6;"></td>
        </tr>
      </tfoot>
    </table>
    <p v-if="data.length">The sample size is {{ data.length.toLocaleString() }}.</p>
    <p v-if="valuesToDisplay !=='raw-numbers'" class="text-muted"><sup>*</sup>Percentages may not add up to 100% due to rounding.</p>
  </div>
</template>

<script>
import naturalSort from "javascript-natural-sort"

export default {
  props: {
    data: {
      type: Array,
      default: []
    },
    rowFields: {
      type: Array,
      default: []
    },
    colFields: {
      type: Array,
      default: []
    },
    reducer: {
      type: Function,
      default: (sum, item) => sum + 1
    },
    noDataWarningText: {
      type: String,
      default: "No data to display."
    },
    // NOTE: Customization
    valuesToDisplay: {
      type: String,
      required: true,
      default: () => 'raw-numbers'
    },
    // NOTE: Customization
    aggregationLogic: {
      type: String,
      required: true
    },
    // NOTE: Customization
    aggregationField: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      values: {} // Alas Vue does not support JS Map
    }
  },
  filters: {
    capitalize: function (value) {
      if (!value) { return '' }
      value = value.toString()
      return value.charAt(0).toUpperCase() + value.slice(1)
    }
  },
  computed: {
    // NOTE: Customization
    entries () {
      return Object.entries(this.values)
    },
    // NOTE: Customization
    colAggregates   () {
      return this.computeChosenAggregates('col')
    },
    // NOTE: Customization
    rowAggregates   () {
      return this.computeChosenAggregates('row')
    },
    // NOTE: Customization
    valuesColPercentage () { return this.computePercentages('col') },
    // NOTE: Customization
    valuesRowPercentage () { return this.computePercentages('row') },
    // NOTE: Customization
    displayedValues () {
      if (this.aggregationLogic === 'count') {
        switch (this.valuesToDisplay) {
          case "raw-numbers":
            return this.values
          case "percentage-col-sum":
            return this.valuesColPercentage
          case "percentage-row-sum":
            return this.valuesRowPercentage
        }
      } else {
        return this.values
      }
    },
    cols () {
      const cols = []

      const extractColsRecursive = (depth, filters) => {
        const getter = this.colFields[depth].getter
        const sort = this.colFields[depth].sort || naturalSort
        const values = [...new Set(this.filteredData({ data: this.data, colFilters: filters }).map(item => getter(item)))].sort(sort)

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[depth] = value

          // Recursive call
          if (depth + 1 < this.colFields.length) {
            extractColsRecursive(depth + 1, valueFilters)
          } else {
            cols.push(valueFilters)
          }
        })
      }

      if (this.colFields.length > 0) {
        extractColsRecursive(0, {})
      } else {
        cols.push({})
      }

      return cols
    },
    rows () {
      const rows = []

      const extractRowsRecursive = (depth, filters) => {
        const getter = this.rowFields[depth].getter
        const sort = this.rowFields[depth].sort || naturalSort
        const values = [...new Set(this.filteredData({ data: this.data, rowFilters: filters }).map(item => getter(item)))].sort(sort)

        values.forEach(value => {
          // Build new filter hash
          const valueFilters = Object.assign({}, filters)
          valueFilters[depth] = value

          // Recursive call
          if (depth + 1 < this.rowFields.length) {
            extractRowsRecursive(depth + 1, valueFilters)
          } else {
            rows.push(valueFilters)
          }
        })
      }

      if (this.rowFields.length > 0) {
        extractRowsRecursive(0, {})
      } else {
        rows.push({})
      }

      return rows
    },
    // Compound property for watch single callback
    colsAndRows () {
      return [this.cols, this.rows]
    }
  },
  methods: {
    // Get data filtered
    filteredData ({ data = [], colFilters = {}, rowFilters = {} }) {
      // Prepare getters
      const colGetters = {}, rowGetters = {}

      for (const depth in colFilters) {
        colGetters[depth] = this.colFields[depth].getter
      }

      for (const depth in rowFilters) {
        rowGetters[depth] = this.rowFields[depth].getter
      }

      // Filter data with getters
      return data.filter(item => {
        let keep = true

        for (const depth in colFilters) {
          if (colGetters[depth](item) !== colFilters[depth]) {
            keep = false
            break
          }
        }

        if (keep) {
          for (const depth in rowFilters) {
            if (rowGetters[depth](item) !== rowFilters[depth]) {
              keep = false
              break
            }
          }
        }

        return keep
      })
    },
    // Get colspan/rowspan size
    spanSize (values, fieldIndex, valueIndex) {
      // If left value === current value
      // and top value === 0 (= still in the same top bracket)
      // The left td will take care of the display
      if (valueIndex > 0 &&
        values[valueIndex - 1][fieldIndex] === values[valueIndex][fieldIndex] &&
        (fieldIndex === 0 || (this.spanSize(values, fieldIndex - 1, valueIndex) === 0))) {
        return 0
      }

      // Otherwise, count entries on the right with the same value
      // But stop if the top value !== 0 (= the top bracket has changed)
      let size = 1
      let i = valueIndex
      while (i + 1 < values.length &&
        values[i + 1][fieldIndex] === values[i][fieldIndex] &&
        (fieldIndex === 0 || (i + 1 < values.length && this.spanSize(values, fieldIndex - 1, i + 1) === 0))) {
        i++
        size++
      }

      return size
    },
    // Called when cols/rows have changed => recompute values
    computeValues () {
      // Remove old values
      this.values = {}

      // Compute new values
      this.rows.forEach(row => {
        const rowData = this.filteredData({ data: this.data, rowFilters: row })
        this.cols.forEach(col => {
          const datasets = this.filteredData({ data: rowData, colFilters: col })
          const key = JSON.stringify({ col, row })
          const aggregate = datasets.reduce(this.reducer, 0)
          const numberOfDatasets = datasets.length
          // const allDatasetsAreNumbers = datasets.every(dataset => !Number.isNaN(Number(dataset[this.aggregationField])))
          const allDatasetsAreNumbers = datasets.every(dataset => typeof(dataset[this.aggregationField]) !== 'string')
          const value = (
            this.aggregationLogic === 'count'
              ? aggregate
              : (
                allDatasetsAreNumbers
                  ? (
                    this.aggregationLogic === 'mean'
                      ? (
                        aggregate && numberOfDatasets
                          ? Math.round((aggregate / numberOfDatasets) * 10) / 10
                          : 0
                      )
                      : aggregate
                  )
                  : 0
              )
          )
          console.group('computeValues')
          console.log('aggregate', aggregate)
          console.log('allDatasetsAreNumbers', allDatasetsAreNumbers)
          console.log('mean', aggregate / numberOfDatasets)
          console.log(typeof aggregate)
          console.log(typeof numberOfDatasets)
          console.log('value', value)
          console.log('numberOfDatasets', numberOfDatasets)
          console.groupEnd('computeValues')
          this.values[key] = value
        })
      })
    },
    // NOTE: Customization
    // Compute the chosen aggregate of columns or rows
    computeChosenAggregates (rowOrCol) {
      return (
        this[`${rowOrCol}s`]
          .map(
            field => {
              let reference = `"${rowOrCol}":${JSON.stringify(field)}`
              let aggregate = (
                this.entries
                  .filter(([key, value]) => key.includes(reference))
                  .map(([key, value]) => value)
                  .reduce((aggregate, figure) => aggregate + figure, 0)
              )
              let numberOfDatasets = this[`${rowOrCol === 'row' ? 'col' : 'row' }s`].length
  
              console.log('computeChosenAggregates—aggregate', aggregate)
              console.log('computeChosenAggregates—numberOfDatasets', numberOfDatasets)
  
              return (
                this.aggregationLogic === 'mean'
                  ? (
                    aggregate && numberOfDatasets
                      ? Math.round((aggregate / numberOfDatasets) * 10) / 10
                      : 0
                  )
                  : aggregate
              )
            }
          )
      )
    },
    computeMean (rowOrCol ,index) {
      let reference = JSON.stringify(this[`${rowOrCol}s`][index])
      let datasets = (
        Object.entries(this[`values${rowOrCol == 'col' ? 'Row': 'Col'}Percentage`])
          .filter(([key, value]) => key.includes(reference))
      )
      let aggregate = datasets.reduce((sum, [key, value]) => sum + value, 0)
      let numberOfDatasets = datasets.length
      
      return Math.round(aggregate / numberOfDatasets * 10) / 10
    },
    // NOTE: Customization
    // Compute every cell as percentage of column or row
    computePercentages (rowOrCol) {
      return (
        this[`${rowOrCol}s`]
          .map((field, index) => {
            let reference = `"${rowOrCol}":${JSON.stringify(field)}`
            return this.entries
              // Get all entries in the row or column
              .filter(([key, value]) => key.includes(reference))
              // Convert value to percentage: `* 100`
              .map(([key, value]) => ({[key]: value / this[`${rowOrCol}Aggregates`][index] * 100}))
          })
          // Flatten the array
          .reduce((array, nestedArray) => [...array, ...nestedArray], [])
          // Convert to object literal
          .reduce((datasets, dataset) => ({ ...datasets, ...dataset }), {})
      )
    },
  },
  watch: {
    colsAndRows () {
      this.computeValues()
    },
    aggregationField () {
      this.computeValues()
    },
    aggregationLogic () {
      this.computeValues()
    }
  },
  created () {
    this.computeValues()
  }
}
</script>

<style scoped>
td {
  min-width: 6rem;
}
/* NOTE: Customizations */
tfoot > tr > td {
  border-top: 2px solid #dee2e6;
  font-style: italic;
  text-align: right;
  color: #6c757d !important;
}
thead > tr > td.summation,
tbody > tr > td.summation {
  border-left: 2px solid #dee2e6;
  font-style: italic;
  text-align: right;
  color: #6c757d !important;
}
tfoot > tr > td:first-child,
thead > tr > td.summation {
  font-weight: bolder;
  text-align: left;
  vertical-align: bottom;
}
</style>
