<?php

/** @var \App\Model\Product $product */
/** @var \App\Service\Router $router */

$title = 'Create Product';
$bodyClass = 'edit';

ob_start(); ?>
    <h1>Create Product</h1>
    <form action="<?= $router->generatePath('product-create') ?>" method="post" class="edit-form">
        <label for="name">Name:</label>
        <input type="text" name="product[name]" id="name" value="<?= $product->getName() ?>" required>

        <label for="description">Description:</label>
        <textarea name="product[description]" id="description" required><?= $product->getDescription() ?></textarea>

        <label for="price">Price:</label>
        <input type="number" step="0.01" name="product[price]" id="price" value="<?= $product->getPrice() ?>" required>

        <input type="submit" value="Create">
    </form>

    <a href="<?= $router->generatePath('product-index') ?>">Back to list</a>
<?php $main = ob_get_clean();

include __DIR__ . DIRECTORY_SEPARATOR . '..' . DIRECTORY_SEPARATOR . 'base.html.php';
