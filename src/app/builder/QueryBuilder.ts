import { Query } from 'mongoose';

class QueryBuilder<T> {
  constructor(
    public modelQuery: Query<T[], T>,
    public query: Record<string, unknown>,
  ) {
    this.modelQuery = modelQuery;
    this.query = query;
  }

  search(searchAbleFields: string[]) {
    if (this?.query?.search) {
      this.modelQuery = this.modelQuery.find({
        $or: searchAbleFields.map((field) => ({
          [field]: { $regex: this.query.search, $options: 'i' },
        })),
      });
    }
    return this;
  }

  filter(filterObj: Record<string, string> | null) {
    let queryObj = { ...this.query };
    if (!filterObj) {
      const excludeFields = ['search', 'page', 'limit', 'sort', 'fields'];
      excludeFields.forEach((field) => delete queryObj[field]);
    } else {
      queryObj = { [filterObj[0]]: filterObj[1] };
    }
    this.modelQuery = this.modelQuery.find(queryObj);

    return this;
  }

  sort() {
    const sortOrder = this?.query?.sortOrder as string;
    const joinBy = sortOrder === 'desc' ? ' -' : '';
    const sort =
      (this?.query?.sort as string).split(',').join(` ${joinBy}`) ||
      `${joinBy}createdAt`;
    this.modelQuery = this.modelQuery.sort(sort);
    return this;
  }
}

export default QueryBuilder;
