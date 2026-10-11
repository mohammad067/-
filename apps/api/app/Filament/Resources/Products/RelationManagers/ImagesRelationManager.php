<?php

namespace App\Filament\Resources\Products\RelationManagers;

use App\Models\ProductImage;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\CreateAction;
use Filament\Actions\DeleteAction;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Schemas\Schema;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ImageColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Illuminate\Support\Facades\DB;

class ImagesRelationManager extends RelationManager
{
    protected static string $relationship = 'images';

    protected static ?string $title = 'تصاویر محصول';

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                FileUpload::make('path')
                    ->label('فایل تصویر')
                    ->disk('public')
                    ->directory($this->imageDirectory())
                    ->visibility('public')
                    ->image()
                    ->imageEditor()
                    ->imageEditorAspectRatioOptions([null, '1:1', '4:3', '16:9'])
                    ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                    ->maxSize(5120)
                    ->imagePreviewHeight('240')
                    ->openable()
                    ->downloadable()
                    ->preventFilePathTampering()
                    ->required(),
                Select::make('product_variant_id')
                    ->label('واریانت مرتبط (اختیاری)')
                    ->options(fn (): array => $this->getOwnerRecord()->variants()
                        ->pluck('title', 'id')
                        ->all())
                    ->searchable()
                    ->preload(),
                TextInput::make('alt_text')
                    ->label('متن جایگزین')
                    ->maxLength(255)
                    ->default(fn (): string => $this->getOwnerRecord()->name),
                Toggle::make('is_primary')
                    ->label('تصویر اصلی محصول')
                    ->helperText('با فعال‌کردن این گزینه، تصویر اصلی قبلی خودکار غیرفعال می‌شود.'),
                Hidden::make('disk')->default('public'),
                Hidden::make('position')
                    ->default(fn (): int => ((int) $this->getOwnerRecord()->images()->max('position')) + 1),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('path')
            ->columns([
                ImageColumn::make('path')
                    ->label('تصویر')
                    ->disk(fn (ProductImage $record): string => $record->disk)
                    ->visibility('public')
                    ->square()
                    ->size(72),
                TextColumn::make('path')
                    ->label('مسیر تصویر')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('alt_text')
                    ->label('متن جایگزین')
                    ->searchable(),
                TextColumn::make('position')
                    ->label('ترتیب')
                    ->numeric()
                    ->sortable(),
                IconColumn::make('is_primary')
                    ->label('اصلی')
                    ->boolean(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Action::make('uploadImages')
                    ->label('آپلود چند تصویر')
                    ->modalHeading('آپلود تصاویر محصول')
                    ->schema([
                        FileUpload::make('paths')
                            ->label('تصاویر')
                            ->disk('public')
                            ->directory($this->imageDirectory())
                            ->visibility('public')
                            ->multiple()
                            ->appendFiles()
                            ->reorderable()
                            ->maxFiles(12)
                            ->maxParallelUploads(2)
                            ->image()
                            ->imageEditor()
                            ->imageEditorAspectRatioOptions([null, '1:1', '4:3', '16:9'])
                            ->acceptedFileTypes(['image/jpeg', 'image/png', 'image/webp'])
                            ->maxSize(5120)
                            ->panelLayout('grid')
                            ->imagePreviewHeight('180')
                            ->required(),
                        Select::make('product_variant_id')
                            ->label('واریانت مرتبط (اختیاری)')
                            ->options(fn (): array => $this->getOwnerRecord()->variants()
                                ->pluck('title', 'id')
                                ->all())
                            ->searchable()
                            ->preload(),
                        TextInput::make('alt_text')
                            ->label('متن جایگزین همه تصاویر')
                            ->maxLength(255)
                            ->default(fn (): string => $this->getOwnerRecord()->name),
                        Toggle::make('make_first_primary')
                            ->label('اولین تصویر، تصویر اصلی باشد')
                            ->default(fn (): bool => ! $this->getOwnerRecord()->images()->exists()),
                    ])
                    ->action(function (array $data, Action $action): void {
                        DB::transaction(function () use ($data): void {
                            $nextPosition = ((int) $this->getOwnerRecord()->images()->max('position')) + 1;

                            foreach (array_values($data['paths']) as $index => $path) {
                                $this->getOwnerRecord()->images()->create([
                                    'product_variant_id' => $data['product_variant_id'] ?? null,
                                    'disk' => 'public',
                                    'path' => $path,
                                    'alt_text' => $data['alt_text'] ?? $this->getOwnerRecord()->name,
                                    'position' => $nextPosition + $index,
                                    'is_primary' => ($data['make_first_primary'] ?? false) && $index === 0,
                                ]);
                            }
                        });

                        $action->success();
                    })
                    ->successNotificationTitle('تصاویر با موفقیت آپلود شدند.'),
                CreateAction::make(),
            ])
            ->recordActions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ])
            ->defaultSort('position')
            ->reorderable('position');
    }

    private function imageDirectory(): string
    {
        return "products/{$this->getOwnerRecord()->public_id}";
    }
}
