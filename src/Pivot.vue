<template>
  <div>
    <!-- Top row -->
    <div
      v-if="showSettings"
      class="row grid-x flex-nowrap mb-4">
      <div class="col left-col">
        <button
          class="btn btn-outline-primary"
          @click="toggleShowSettings">
          {{ hideSettingsText }}
        </button>
      </div>

      <!-- Disabled fields -->
      <div class="col">
        <div class="drag-area-label">
          {{ availableFieldsLabelText }}
        </div>
        <draggable
          :disabled="modalIsOpen"
          v-model="internal.fields"
          class="d-flex flex-row drag-area flex-wrap"
          :class="dragAreaClass"
          group="fields"
          @start="start"
          @end="end">
          <div
            v-for="field in internal.fields"
            :key="field.label">
            <details
              v-if="fieldFilters.hasOwnProperty(field.label)"
              :id="`details-${field.label.toLowerCase().split(' ').join('-')}`"
              @toggle="toggleModal"
              class="btn btn-draggable btn-secondary">
              <summary>
                <svg
                  aria-hidden="true"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 270 512"
                  class="svg-inline--fa fa-grip-vertical fa-w-10">
                  <path
                    fill="currentColor"
                    d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                    class=""/>
                </svg>
                {{ field.label }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="filter"
                  class="small svg-inline--fa fa-filter fa-w-10"
                  role="img"
                  viewBox="0 0 512 512"><path
                    fill="currentColor"
                    d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"/>
                </svg>
              </summary>
              <div
                class="filter-modal modal-content"
                style="width: fit-content; min-width: 30vmin;">
                <div class="modal-header">
                  <h5 class="modal-title">
                    {{ field.label }}
                  </h5>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <div
                      v-for="(value, key) in fieldFilters[field.label]"
                      :key="`${field.label}-${key}`"
                      class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="key"
                        :id="key"
                        v-model="fieldFilters[field.label][key]"
                        checked>
                      <label
                        class="form-check-label"
                        :for="key">
                        {{ key }}
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  class="modal-footer"
                  style="justify-content: space-between;">
                  <button
                    type="button"
                    @click="dismissModal(`details-${field.label.toLowerCase().split(' ').join('-')}`)"
                    class="btn btn-secondary"
                    data-dismiss="modal">
                    Cancel
                  </button>
                  <button
                    type="button"
                    @click="applyFieldFilters(`details-${field.label.toLowerCase().split(' ').join('-')}`)"
                    class="btn btn-primary">
                    Apply
                  </button>
                </div>
              </div>
            </details>
            <div
              v-else
              class="btn btn-draggable btn-secondary">
              <svg
                aria-hidden="true"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 270 512"
                class="svg-inline--fa fa-grip-vertical fa-w-10">
                <path
                  fill="currentColor"
                  d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                  class=""/>
              </svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div
      class="mb-4"
      v-else>
      <button
        class="btn btn-outline-primary"
        @click="toggleShowSettings">
        {{ showSettingsText }}
      </button>
    </div>

    <div
      class="row grid-x mb-4"
      v-if="showSettings">
      <!-- Top left zone - TODO: renderer select menu -->
      <div class="col left-col"/>

      <!-- Horizontal fields -->
      <div class="col">
        <div class="drag-area-label">
          {{ colsLabelText }}
        </div>
        <draggable
          :disabled="modalIsOpen"
          v-model="internal.colFields"
          class="d-flex flex-row drag-area flex-wrap"
          :class="dragAreaClass"
          group="fields"
          @start="start"
          @end="end">
          <div
            v-for="field in internal.colFields"
            :key="field.label">
            <details
              v-if="fieldFilters.hasOwnProperty(field.label)"
              :id="`details-${field.label.toLowerCase().split(' ').join('-')}`"
              @toggle="toggleModal"
              class="btn btn-draggable btn-primary">
              <summary>
                <svg
                  aria-hidden="true"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 270 512"
                  class="svg-inline--fa fa-grip-vertical fa-w-10">
                  <path
                    fill="currentColor"
                    d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                    class=""/>
                </svg>
                {{ field.label }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="filter"
                  class="small svg-inline--fa fa-filter fa-w-10"
                  role="img"
                  viewBox="0 0 512 512"><path
                    fill="currentColor"
                    d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"/>
                </svg>
              </summary>
              <div
                class="filter-modal modal-content"
                style="width: fit-content; min-width: 30vmin;">
                <div class="modal-header">
                  <h5 class="modal-title">
                    {{ field.label }}
                  </h5>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <div
                      v-for="(value, key) in fieldFilters[field.label]"
                      :key="`${field.label}-${key}`"
                      class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="key"
                        :id="key"
                        v-model="fieldFilters[field.label][key]"
                        checked>
                      <label
                        class="form-check-label"
                        :for="key">
                        {{ key }}
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  class="modal-footer"
                  style="justify-content: space-between;">
                  <button
                    type="button"
                    @click="dismissModal(`details-${field.label.toLowerCase().split(' ').join('-')}`)"
                    class="btn btn-secondary"
                    data-dismiss="modal">
                    Cancel
                  </button>
                  <button
                    type="button"
                    @click="applyFieldFilters(`details-${field.label.toLowerCase().split(' ').join('-')}`)"
                    class="btn btn-primary">
                    Apply
                  </button>
                </div>
              </div>
            </details>
            <div
              v-else
              class="btn btn-draggable btn-secondary">
              <svg
                aria-hidden="true"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 270 512"
                class="svg-inline--fa fa-grip-vertical fa-w-10">
                <path
                  fill="currentColor"
                  d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                  class=""/>
              </svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>
    </div>

    <div class="row flex-nowrap grid-x">
      <!-- Vertical fields -->
      <div
        class="col left-col"
        v-if="showSettings">
        <div class="drag-area-label">
          {{ rowsLabelText }}
        </div>
        <draggable
          :disabled="modalIsOpen"
          v-model="internal.rowFields"
          class="d-flex flex-row drag-area flex-wrap"
          :class="dragAreaClass"
          group="fields"
          @start="start"
          @end="end">
          <div
            v-for="field in internal.rowFields"
            :key="field.label">
            <details
              v-if="fieldFilters.hasOwnProperty(field.label)"
              :id="`details-${field.label.toLowerCase().split(' ').join('-')}`"
              @toggle="toggleModal"
              class="btn btn-draggable btn-primary">
              <summary>
                <svg
                  aria-hidden="true"
                  role="img"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 270 512"
                  class="svg-inline--fa fa-grip-vertical fa-w-10">
                  <path
                    fill="currentColor"
                    d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                    class=""/>
                </svg>
                {{ field.label }}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  focusable="false"
                  data-prefix="fas"
                  data-icon="filter"
                  class="small svg-inline--fa fa-filter fa-w-10"
                  role="img"
                  viewBox="0 0 512 512"><path
                    fill="currentColor"
                    d="M487.976 0H24.028C2.71 0-8.047 25.866 7.058 40.971L192 225.941V432c0 7.831 3.821 15.17 10.237 19.662l80 55.98C298.02 518.69 320 507.493 320 487.98V225.941l184.947-184.97C520.021 25.896 509.338 0 487.976 0z"/>
                </svg>
              </summary>
              <div
                class="filter-modal modal-content"
                style="width: fit-content; min-width: 30vmin;">
                <div class="modal-header">
                  <h5 class="modal-title">
                    {{ field.label }}
                  </h5>
                </div>
                <div class="modal-body">
                  <div class="form-group">
                    <div
                      v-for="(value, key) in fieldFilters[field.label]"
                      :key="`${field.label}-${key}`"
                      class="form-check">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        :value="key"
                        :id="key"
                        v-model="fieldFilters[field.label][key]"
                        checked>
                      <label
                        class="form-check-label"
                        :for="key">
                        {{ key }}
                      </label>
                    </div>
                  </div>
                </div>
                <div
                  class="modal-footer"
                  style="justify-content: space-between;">
                  <button
                    type="button"
                    @click="dismissModal(`details-${field.label.toLowerCase().split(' ').join('-')}`)"
                    class="btn btn-secondary"
                    data-dismiss="modal">
                    Cancel
                  </button>
                  <button
                    type="button"
                    @click="applyFieldFilters(`details-${field.label.toLowerCase().split(' ').join('-')}`)"
                    class="btn btn-primary">
                    Apply
                  </button>
                </div>
              </div>
            </details>
            <div
              v-else
              class="btn btn-draggable btn-secondary">
              <svg
                aria-hidden="true"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 270 512"
                class="svg-inline--fa fa-grip-vertical fa-w-10">
                <path
                  fill="currentColor"
                  d="M64 208c26.5 0 48 21.5 48 48s-21.5 48-48 48-48-21.5-48-48 21.5-48 48-48zM16 104c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48zm0 304c0 26.5 21.5 48 48 48s48-21.5 48-48-21.5-48-48-48-48 21.5-48 48z M204 208c26.5 0 48 21.5 48 48s-21.5 48 -48 48 -48 -21.5 -48 -48 21.5 -48 48 -48zM156 104c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48zm0 304c0 26.5 21.5 48 48 48s48 -21.5 48 -48 -21.5 -48 -48 -48 -48 21.5 -48 48z"
                  class=""/>
              </svg>
              {{ field.label }}
            </div>
          </div>
        </draggable>
      </div>

      <!-- Table -->
      <div class="col table-responsive">
        <pivot-table
          :data="filteredData"
          :row-fields="internal.rowFields"
          :col-fields="internal.colFields"
          :reducer="reducer"
          :no-data-warning-text="noDataWarningText"
          :values-to-display="valuesToDisplay"
          :aggregation-logic="aggregationLogic"
          :aggregation-field="aggregationField"
          :heatmap-mode="heatmapMode"
          :show-heatmap="showHeatmap">
          <!-- pass down scoped slots -->
          <template
            v-for="(slot, slotName) in $scopedSlots"
            :slot="slotName"
            slot-scope="{ value }">
            <slot
              :name="slotName"
              v-bind="{ value }"/>
          </template>
        </pivot-table>
      </div>
    </div>
  </div>
</template>

<script>
import PivotTable from './PivotTable'
import Draggable from 'vuedraggable'

export default {
  components: { PivotTable, Draggable },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    fields: {
      type: Array,
      default: () => []
    },
    rowFields: {
      type: Array,
      default: () => []
    },
    colFields: {
      type: Array,
      default: () => []
    },
    reducer: {
      type: Function,
      default: (sum, item) => sum + 1
    },
    defaultShowSettings: {
      type: Boolean,
      default: () => true
    },
    availableFieldsLabelText: {
      type: String,
      default: () => 'Available fields'
    },
    colsLabelText: {
      type: String,
      default: () => 'Columns'
    },
    rowsLabelText: {
      type: String,
      default: () => 'Rows'
    },
    hideSettingsText: {
      type: String,
      default: () => 'Hide settings'
    },
    showSettingsText: {
      type: String,
      default: () => 'Show settings'
    },
    noDataWarningText: {
      type: String,
      default: () => 'No data to display.'
    },
    valuesToDisplay: {
      type: String,
      required: true
    },
    aggregationLogic: {
      type: String,
      required: true
    },
    aggregationField: {
      type: String,
      required: true
    },
    heatmapMode: {
      type: String,
      required: true,
      default: () => 'table'
    },
    showHeatmap: {
      type: Boolean,
      required: false
    }
  },
  data: function () {
    return {
      internal: {
        fields: this.fields,
        rowFields: this.rowFields,
        colFields: this.colFields
      },
      dragging: false,
      showSettings: true,
      modalIsOpen: false,
      fieldFilters: {},
      filteredData: []
    }
  },
  computed: {
    dragAreaClass: function () {
      return this.dragging ? 'drag-area-highlight' : null
    },
    fieldsToFilter: function () {
      return (
        Object.entries(this.fieldFilters)
          .map(
            ([key, values]) => {
              return [
                key,
                Object.entries(values)
                  .filter(([key, boolean]) => !boolean)
                  .map(([key, boolean]) => key)
              ]
            }
          )
          .filter(
            ([key, values]) => !!values.length
          )
          .reduce(
            (fields, [key, values]) => {
              return { ...fields, [key]: values }
            },
            {}
          )
      )
    }
  },
  methods: {
    toggleShowSettings: function () {
      this.showSettings = !this.showSettings
    },
    start: function () {
      this.dragging = true
    },
    end: function () {
      this.dragging = false
    },
    toggleModal () {
      this.modalIsOpen = !this.modalIsOpen
    },
    dismissModal (detailsId) {
      document.getElementById(detailsId).open = false
    },
    applyFieldFilters (detailsId) {
      this.filteredData = [...this.filterData()]
      document.getElementById(detailsId).open = false
    },
    constructFieldFilters: function () {
      if (!this.data.length) { return null }
      return (
        Object.keys(this.data[0])
          // Exclude fields where all values are numbers
          .filter(
            field => this.data.some(entry => typeof entry[field] === 'string')
          )
          // Map each field to their possible unique values
          .map(
            field => {
              return {
                [field]: (
                  // Derive sets of possible values for each fields and sort them
                  Array.from(new Set(this.data.map(entry => entry[field]))).sort()
                    // Construct data property for v-model
                    .map(
                      value => {
                        return { [value]: true }
                      }
                    )
                    // Convert array into object
                    .reduce(
                      (values, value) => {
                        return { ...values, ...value }
                      },
                      {}
                    )
                )
              }
            }
          )
          // Convert array into object
          .reduce(
            (fields, field) => {
              return { ...fields, ...field }
            },
            {}
          )
      )
    },
    filterData: function () {
      let entries = Object.entries(this.fieldsToFilter)
      return (
        this.data.filter(
          entry => {
            return entries.every(
              ([key, values]) => !values.includes(entry[key])
            )
          }
        )
      )
    }
  },
  created: function () {
    this.showSettings = this.defaultShowSettings
    this.fieldFilters = { ...this.constructFieldFilters() }
    this.filteredData = [...this.data]
  },
}
</script>

<style lang="scss" scoped>
/* Filter Modal */
summary:focus {
  outline: none !important;
}
details[open] > summary::before {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: block;
  cursor: default;
  content: " ";
  z-index: 99;
  background: rgba(27,31,35,0.5);
}
details > .filter-modal {
  cursor: default !important;
  color: initial;
  left: 50vw;
  top: 50vh;
  transform: translate(-50%, -50%);
  max-height: 80vh;
  max-width: 90vw;
  position: fixed;
  /*width: 50vw;*/
  z-index: 999;
  animation-name: fadein;
  animation-duration: 300ms;
  animation-timing-function: ease-in-out;
}
@keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
details summary::-webkit-details-marker {
  display:none;
}

/* Left column width */
.left-col {
  min-width: 200px;
  max-width: 200px;
}

/* Grid with even gutters */
.grid-x {
  margin: 0 -0.75rem;
  > * {
    padding: 0 0.75rem;
  }
}

/* Drag & drop stuff */
.drag-area {
  min-width: 10rem;
  min-height: 6.5rem;
  border: 1px dashed #ccc;
  padding: 0.5rem;
  transition: background-color 0.4s;

  > div {
    margin: 0.5rem;
  }

  * {
    cursor: move !important;
  }

  padding-top: 2.5rem;
}

.drag-area-highlight {
  background-color: #f3f3f3;
}

.drag-area-label {
  position: absolute;
  padding: 0.75rem 1rem;
}

.sortable-ghost {
  opacity: 0.4;
}

/* Handle icon (mix of grip-vertical & ellipsis-v) */
.svg-inline--fa.fa-w-10 {
  width: 0.625em;
}

.svg-inline--fa {
  display: inline-block;
  font-size: inherit;
  height: 1em;
  overflow: visible;
  vertical-align: -.125em;
}

.btn-draggable .fa-grip-vertical {
  margin-left: -0.375rem;
  margin-right: 0.375rem;
}

/* Draggable buttons */
.btn-draggable {
  white-space: normal;
  text-align: left;
}
</style>
