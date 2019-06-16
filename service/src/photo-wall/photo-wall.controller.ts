import { Controller, Get, Post, Delete, Query, UseInterceptors, UploadedFile } from '@nestjs/common/index';
import { FileInterceptor } from '@nestjs/platform-express/index';
import { PhotoWallService } from './photo-wall.service';
// import { PhotoWall } from './photo-wall.interface';
import { PhotoWallDto } from './photo-wall.dto';
import { Page } from '../common/page.dto';
import { FileDto } from '../common/file.dto';

@Controller()
export class PhotoWallController {

  constructor(private readonly photoWallService: PhotoWallService) {}
  /**
   * 查询照片列表
   * @param photoWallDto 查询条件
   * @param page 分页
   */
  @Get('/photowall/list')
  list(@Query() photoWallDto: PhotoWallDto, @Query() page: Page): Promise<Page> {
    if(page.pageNum && page.limit) {
      page.start = ~~page.limit * (~~page.pageNum - 1);
    }
    return this.photoWallService.list(photoWallDto, page);
  }
  /**
   * 删除照片
   * @param hitokotoDto 需要删除的多个ID
   */
  @Delete('/photowall/delete')
  delete(@Query() photoWallDto: PhotoWallDto): Promise<String> {
    return this.photoWallService.delete(photoWallDto._ids);
  }
  /**
   * 上传照片, 同步到对象存储仓库并保存照片信息
   * @param image 
   */
  @Post('/photowall/upload')
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(@UploadedFile() image: FileDto) {
    return this.photoWallService.save(image);
  }
}
