<?php

/** @var \App\Model\Product $product */
/** @var \App\Service\Router $router */

$title = 'Create Product';
$bodyClass = "edit";

ob_start(); ?>
    <label for="name">Name:</label>
    <input type="text" name="product[name]" id="name" value="<?= $product->getName() ?>" required>

    <label for="description">Description:</label>
    <textarea name="product[description]" id="description" required><?= $product->getDescription() ?></textarea>

    <label for="price">Price:</label>
    <input type="number" step="0.01" name="product[price]" id="price" value="<?= $product->getPrice() ?>" required>

    <input type="submit" value="Save">
<?php $form = ob_get_clean();
