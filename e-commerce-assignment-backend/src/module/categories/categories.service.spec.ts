import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';
import { Repository } from 'typeorm';

const mockCategories = [
  { id: '1', slug: 'mens-shoes', name: 'Mens Shoes' },
  { id: '2', slug: 'home-decoration', name: 'Home Decoration' },
];

describe('CategoriesService', () => {
  let service: CategoriesService;
  let repository: Repository<Category>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: {
            find: jest.fn().mockResolvedValue(mockCategories),
          },
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    repository = module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of categories', async () => {
      const categories = await service.findAll();
      
      expect(categories).toEqual(mockCategories);
      expect(repository.find).toHaveBeenCalledWith({
        order: { name: 'ASC' },
      });
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  });
});
