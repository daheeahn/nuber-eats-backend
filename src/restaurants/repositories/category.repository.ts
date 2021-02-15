import { EntityRepository, Repository } from 'typeorm';
import { Category } from '../entities/category.entity';

@EntityRepository(Category)
export class CategoryRepository extends Repository<Category> {
  // this 자체가 this.categories이기 때문에 this.으로 하면 그 자체가 repository다! wow!

  async getOrCreate(name: string): Promise<Category> {
    const categoryName = name.trim().toLowerCase(); // korean bbq, korean-bbq, Korean-BBQ
    const categorySlug = categoryName.replace(/ /g, '-');
    let category = await this.findOne({ slug: categorySlug });
    if (!category) {
      category = await this.save(
        this.create({ slug: categorySlug, name: categoryName }),
      );
    }
    return category;
  }
}
