import { Controller, Get, Query, Post, Body, Res } from '@nestjs/common'
import AppService from './app.service'
import HitokotoService from './hitokoto/hitokoto.service'
import PhotoWallService from './photo-wall/photo-wall.service'
import ArticleService from './article/article.service'
import { Hitokoto, HitokotoDto } from './hitokoto/hitokoto.interface'
import { ArticleDto } from './article/article.interface'
import { Page, MsgResult } from './common/common.dto'
import SystemUser from './system/system-user.interface'
import PageTransform from './common/page.transform'
import SystemService from './system/system.service';
import { Response } from 'express'

import * as fs from 'fs'
import { Readable } from 'stream'

@Controller('/common')
export default class AppController {
  constructor(
    private readonly hitokotoService: HitokotoService,
    private readonly photoWallService: PhotoWallService,
    private readonly articleService: ArticleService,
    private readonly systemService: SystemService,
    private readonly appService: AppService,
  ) {}
  /**
   * 登录
   * @param systemUser 用户名 密码
   */
  @Post('/login')
  login(@Body() systemUser: SystemUser): Promise<object> {
    return this.appService.login(systemUser)
  }

  /**
   * 校验Token
   * @param tokenObj Token字符串
   */
  @Post('/verifyToken')
  verifyToken(@Body() tokenObj: {token: string}): Promise<object> {
    if (!tokenObj.token) {
      return Promise.resolve(new MsgResult(false, '未获得Token'))
    }
    return this.appService.verifyToken(tokenObj.token)
  }

  /**
   * 随机获取一条一言
   * @param hitokotoDto 筛选条件
   */
  @Get('/hitokoto')
  getHitokoto(@Query() hitokotoDto: HitokotoDto): Promise<string | Hitokoto | MsgResult> {
    return this.hitokotoService.findOne(hitokotoDto)
  }

  /**
   * 分页查询照片
   */
  @Get('/photos')
  getPhotos(@Query(PageTransform) page: Page): Promise<Page | MsgResult> {
    return this.photoWallService.queryPage(page)
  }

  /**
   * 获取一言类型
   */
  @Get('/hitokotoTypes')
  listHitokotoTypes(): Promise<object> {
    return this.systemService.getConfig('hitokoto_type')
  }

  /**
   * 获取图片存储CDN地址
   */
  @Get('/pictureCdn')
  getPictureCdn(): Promise<object> {
    return this.systemService.getConfig('picture_cdn')
  }

  /**
   * 获取Valine评论配置
   */
  @Get('/valineConfig')
  getValineConfig(): Promise<object> {
    return this.systemService.getConfig('valine_config')
  }

  /**
   * 博客文章内容全文检索
   * @param articleDto 查询关键词
   * @param page 分页信息
   */
  @Get('/search')
  search(@Query() articleDto: ArticleDto, @Query(PageTransform) page: Page): Promise<Page> {
    if (!articleDto.words) {
      return Promise.resolve(page)
    }
    return this.articleService.search(articleDto.words, page)
  }

  @Get('/randomBg')
  randomBg(@Res() res: Response): void {
    const buffer = fs.readFileSync('D:\\64478920_p2_.png')
    const stream = new Readable();

    stream.push(buffer)
    stream.push(null)
    res.set({
      'Content-Type': 'image/png',
      'Content-Length': buffer.length,
    })
    stream.pipe(res)
  }
}
