import _defaultsDeep from 'lodash/defaultsDeep'

import BreadPlate from './BreadPlate'
import BigRoad from './BigRoad'
import BigEyeBoy from './BigEyeBoy'
import SmallRoad from './SmallRoad'
import CockroachPig from './CockroachPig'

function attachToContext(obj, ctx) {
  for (const key in obj) {
    ctx[key] = obj[key]
  }
}

// 路途全屏时候专用
export default class Roadmap {
  constructor(_options) {
    const options = _defaultsDeep(_options, {
      results: [],
      config: {
        breadplate: {
          show_options: true,
          rows: 6,
          cols: 14
        },
        bigroad: {
          show_options: false,
          rows: 6,
          cols: 28
        },
        // 下三路都是一个标准格子存放2个元素
        bigeyeboy: {
          show_options: false,
          rows: 6, // 大格=小格*2
          cols: 56
        },
        smallroad: {
          show_options: false,
          rows: 6,
          cols: 56
        },
        cockroachPig: {
          show_options: false,
          rows: 6,
          cols: 56
        }
      }
    })

    attachToContext(options, this)

    this.breadplate = new BreadPlate({
      results: this.results,
      rows: this.config.breadplate.rows,
      cols: this.config.breadplate.cols
    })

    this.bigroad = new BigRoad({
      results: this.results,
      rows: this.config.bigroad.rows,
      cols: this.config.bigroad.cols
    })

    this.bigeyeboy = new BigEyeBoy({
      bigRoadMatrix: this.bigroad.matrix,
      rows: this.config.bigeyeboy.rows,
      cols: this.config.bigeyeboy.cols
    })

    this.smallroad = new SmallRoad({
      bigRoadMatrix: this.bigroad.matrix,
      rows: this.config.smallroad.rows,
      cols: this.config.smallroad.cols
    })

    this.cockroachPig = new CockroachPig({
      bigRoadMatrix: this.bigroad.matrix,
      rows: this.config.cockroachPig.rows,
      cols: this.config.cockroachPig.cols
    })
  }

  push(key) {
    this.results.push(key)

    this.breadplate.push(key)

    this.bigroad.push(key)

    this.bigeyeboy.bigRoadMatrix = this.bigroad.matrix
    this.bigeyeboy.traverseBigRoadScheme()

    this.smallroad.bigRoadMatrix = this.bigroad.matrix
    this.smallroad.traverseBigRoadScheme()

    this.cockroachPig.bigRoadMatrix = this.bigroad.matrix
    this.cockroachPig.traverseBigRoadScheme()
  }

  update() {
    this.bigeyeboy.bigRoadMatrix = this.bigroad.matrix
    this.bigeyeboy.traverseBigRoadScheme()

    this.smallroad.bigRoadMatrix = this.bigroad.matrix
    this.smallroad.traverseBigRoadScheme()

    this.cockroachPig.bigRoadMatrix = this.bigroad.matrix
    this.cockroachPig.traverseBigRoadScheme()
  }
}
