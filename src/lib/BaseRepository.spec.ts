import { Model, Document, FilterQuery } from 'mongoose';
import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from './BaseRepository';

interface TestDocument extends Document {
  name: string;
  isDeleted?: boolean;
}

describe('BaseRepository', () => {
  let baseRepository: BaseRepository<TestDocument>;
  let mockModel: jest.Mocked<Model<TestDocument>>;

  beforeEach(() => {
    mockModel = {
      create: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
    } as unknown as jest.Mocked<Model<TestDocument>>;

    baseRepository = new BaseRepository(mockModel, 'Entity', ['privateField']);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find all documents', async () => {
    const mockDocuments = [
      { _id: '1', name: 'Document 1' },
      { _id: '2', name: 'Document 2' },
    ] as TestDocument[];

    mockModel.find.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDocuments),
    } as any);

    const result = await baseRepository.findAll();

    expect(result).toEqual(mockDocuments);
    expect(mockModel.find).toHaveBeenCalledWith();
  });

  it('should find one document', async () => {
    const filter: FilterQuery<TestDocument> = { _id: 'some-id' };
    const mockDocument = {
      _id: 'some-id',
      name: 'Test Document',
    } as TestDocument;

    mockModel.findOne.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDocument),
    } as any);

    const result = await baseRepository.findOne(filter);

    expect(result).toEqual(mockDocument);
    expect(mockModel.findOne).toHaveBeenCalledWith(filter);
  });

  it('should find document by ID', async () => {
    const mockId = 'some-id';
    const mockDocument = { _id: mockId, name: 'Test Document' } as TestDocument;

    mockModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDocument),
    } as any);

    const result = await baseRepository.findById(mockId);

    expect(result).toEqual(mockDocument);
    expect(mockModel.findById).toHaveBeenCalledWith(mockId);
  });

  it('should throw NotFoundException when document by ID is not found', async () => {
    const mockId = 'non-existing-id';

    mockModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(null),
    } as any);

    await expect(baseRepository.findByIdOrFail(mockId)).rejects.toThrowError(
      NotFoundException,
    );
  });

  it('should update a document', async () => {
    const mockId = 'some-id';
    const mockUpdateDto = { name: 'Updated Document' };
    const mockPreviousDocument = {
      _id: mockId,
      name: 'Old Document',
    } as TestDocument;
    const mockUpdatedDocument = {
      _id: mockId,
      name: 'Updated Document',
    } as TestDocument;

    mockModel.findById.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockPreviousDocument),
    } as any);
    mockModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUpdatedDocument),
    } as any);

    const result = await baseRepository.update(mockId, mockUpdateDto);

    expect(result.previous).toEqual(mockPreviousDocument);
    expect(result.updated).toEqual(mockUpdatedDocument);
    expect(mockModel.findById).toHaveBeenCalledWith(mockId);
    expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockId,
      mockUpdateDto,
      { new: true },
    );
  });

  it('should remove a document', async () => {
    const mockId = 'some-id';
    const mockDocument = {
      _id: mockId,
      name: 'Document to be removed',
    } as TestDocument;

    mockModel.findByIdAndDelete.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockDocument),
    } as any);

    const result = await baseRepository.remove(mockId);

    expect(result).toEqual(mockDocument);
    expect(mockModel.findByIdAndDelete).toHaveBeenCalledWith(mockId);
  });

  it('should soft remove a document', async () => {
    const mockId = 'some-id';
    const mockDocument = {
      _id: mockId,
      name: 'Document to be soft removed',
    } as TestDocument;
    const mockUpdatedDocument = {
      ...mockDocument,
      isDeleted: true,
    } as TestDocument;

    mockModel.findByIdAndUpdate.mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUpdatedDocument),
    } as any);

    const result = await baseRepository.softRemove(mockId);

    expect(result).toEqual(mockUpdatedDocument);
    expect(mockModel.findByIdAndUpdate).toHaveBeenCalledWith(
      mockId,
      { isDeleted: true },
      { new: true },
    );
  });
});
