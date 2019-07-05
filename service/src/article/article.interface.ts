import { Schema, Document } from 'mongoose'
import BaseQc from 'src/common/base.qc';
import { totalmem } from 'os';

export interface Article extends Document {
  _id?: Schema.Types.ObjectId
  title?: string // 文章标题
  path?: string // 文章访问路径
  create_date?: Date // 创建时间
  categories?: string[] // 分类
  tags?: string[] // 标签
  content?: string // 正文内容
  content_hash?: string // 正文内容Hash(SHA1)
}

export interface ArticleKeys extends Document {
  _id: Schema.Types.ObjectId
  article_id: Schema.Types.ObjectId
  keys: string[]
}

export class ArticleQc extends BaseQc {
  title?: {
    $regex?: RegExp}
  create_date?: {
    $gte: Date
    $lte: Date}
  is_splited?: boolean
  categories?: string
  tags?: string
  constructor(articleDto: ArticleDto) {
    super()
    if (articleDto.title) {
      this.title = {$regex: new RegExp(articleDto.title)}
    }
    if (articleDto.createDate && articleDto.createDate[0] && articleDto.createDate[1]) {
      this.create_date = {
        $gte: new Date(articleDto.createDate[0]),
        $lte: new Date(articleDto.createDate[1]),
      }
    }
    switch(articleDto.isSplited) {
      case 'true':
        this.is_splited = true
        break
      case 'false':
        this.is_splited = false
        break
    }
    if(articleDto.category) {
      this.categories = articleDto.category
    }
    if(articleDto.tag) {
      this.tags = articleDto.tag
    }
  }
}

export interface ArticleDto {
  /**
   * 多个ID, 用于批量操作
   */
  _ids: string[]
  _id: Schema.Types.ObjectId
  /**
   * 标题模糊搜索
   */
  title: string
  /**
   * 创建时间范围搜索, 数组包含2个元素
   * 分别是起始时间与结束时间的 UTS 字符串
   */
  createDate: string[]
  /**
   * 分类
   */
  category: string
  /**
   * 标签
   */
  tag: string
  /**
   * 是否已分词, 'true'已分词, 'false'未分词
   */
  isSplited: string
  /**
   * 搜索关键字
   */
  words: string
  /**
   * 关键字匹配数量
   */
  num: number
  /**
   * 数据总数
   */
  total: number
  /**
   * 匹配到的文章信息
   */
  articles: Article[][]
}
