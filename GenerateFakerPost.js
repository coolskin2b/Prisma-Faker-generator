const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

const prisma = new PrismaClient();

async function createCategory(name, slug, order) {
    return await prisma.category.create({
      data: {
        name,
        slug,
        order,
      },
    });
  }
  
  async function createSubCategory(name, slug, order, categoryId) {
    return await prisma.subCategory.create({
      data: {
        name,
        slug,
        order,
        categoryId,
      },
    });
  }
  
  async function createPost(
    title,
    slug,
    content,
    author,
    metaTitle,
    categoryId,
    subCategoryId
  ) {
    return await prisma.post.create({
      data: {
        title,
        slug,
        content,
        published: true,
        author,
        metaTitle,
        metaDescription: faker.lorem.sentence(10),
        metaKeywords: [faker.lorem.word(), faker.lorem.word()],
        canonicalURL: faker.internet.url(),
        headerImage: faker.image.urlLoremFlickr({ width: 1100 }),
        tags: [faker.lorem.word(), faker.lorem.word()],
        publishedDate: faker.date.past(),
        updateDate: faker.date.recent(),
        categoryId,
        subCategoryId,
      },
    });
  }
async function main() {
  // Création de 4 catégories
  for (let i = 0; i < 4; i++) {
    const category = await createCategory(faker.lorem.word(), faker.helpers.slugify(faker.lorem.word()), i);
    
    // Création de 4 sous-catégories pour chaque catégorie
    for (let j = 0; j < 4; j++) {
      const subCategory = await createSubCategory(faker.lorem.word(), faker.helpers.slugify(faker.lorem.word()), j, category.id);
      
      // Création de 5 articles pour chaque sous-catégorie
      for (let k = 0; k < 5; k++) {
        await createPost(faker.lorem.sentence(5), faker.helpers.slugify(faker.lorem.sentence(5)), faker.lorem.paragraph(5), faker.person.fullName(), faker.lorem.sentence(5), category.id, subCategory.id);
      }
    }
  }
  
  console.log("Création terminée.");
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
