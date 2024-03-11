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

export default class Roadmap {
  constructor(_options) {
    const options = _defaultsDeep(_options, {
      results: [],
      config: {
        breadplate: {
          show_options: false,
          rows: 6,
          cols: 6
        },
        bigroad: {
          show_options: false,
          rows: 6,
          cols: 20
        },
        // 下三路都是一个标准格子存放2个元素
        bigeyeboy: {
          show_options: false,
          rows: 6, // 大格=小格*2
          cols: 40
        },
        smallroad: {
          show_options: false,
          rows: 6,
          cols: 20
        },
        cockroachPig: {
          show_options: false,
          rows: 6,
          cols: 20
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

    // 另外一个不同行列数的大路 用于下三路的结果生成
    // 行数设置成 15 （本方法中 大路结果列满换列后 影响下三路的生成
    this.bigRoadForThree = new BigRoad({
      results: this.results,
      rows: 15,
      cols: 40
    })

    this.bigeyeboy = new BigEyeBoy({
      bigRoadMatrix: this.bigRoadForThree.matrix,
      rows: this.config.bigeyeboy.rows,
      cols: this.config.bigeyeboy.cols
    })

    this.smallroad = new SmallRoad({
      bigRoadMatrix: this.bigRoadForThree.matrix,
      rows: this.config.smallroad.rows,
      cols: this.config.smallroad.cols
    })

    this.cockroachPig = new CockroachPig({
      bigRoadMatrix: this.bigRoadForThree.matrix,
      rows: this.config.cockroachPig.rows,
      cols: this.config.cockroachPig.cols
    })
  }

  push(key) {
    this.results.push(key)

    this.breadplate.push(key)

    this.bigroad.push(key)

    this.bigeyeboy.bigRoadMatrix = this.bigRoadForThree.matrix
    this.bigeyeboy.traverseBigRoadScheme()

    this.smallroad.bigRoadMatrix = this.bigRoadForThree.matrix
    this.smallroad.traverseBigRoadScheme()

    this.cockroachPig.bigRoadMatrix = this.bigRoadForThree.matrix
    this.cockroachPig.traverseBigRoadScheme()
  }

  update() {
    this.bigeyeboy.bigRoadMatrix = this.bigRoadForThree.matrix
    this.bigeyeboy.traverseBigRoadScheme()

    this.smallroad.bigRoadMatrix = this.bigRoadForThree.matrix
    this.smallroad.traverseBigRoadScheme()

    this.cockroachPig.bigRoadMatrix = this.bigRoadForThree.matrix
    this.cockroachPig.traverseBigRoadScheme()
  }
}
