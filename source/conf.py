# Configuration file for the Sphinx documentation builder.
#
# For the full list of built-in configuration values, see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Project information -----------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#project-information

project = '@script'
copyright = '2023-2024, Atarabi'
author = 'Atarabi'
release = '0.4.0'

# -- General configuration ---------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#general-configuration

extensions = ['sphinx.ext.githubpages', 'sphinx_code_tabs']

templates_path = ['_templates']
exclude_patterns = ['_build', 'Thumbs.db', '.DS_Store']

language = 'jp'

# -- Options for HTML output -------------------------------------------------
# https://www.sphinx-doc.org/en/master/usage/configuration.html#options-for-html-output

html_theme = 'classic'
html_theme_options = {
    'footerbgcolor': '#27232F',
    'footertextcolor': '#EBEDE6',
    'sidebarbgcolor': '#50495D',
    # 'sidebarbtncolor': 'white',
    'sidebartextcolor': '#A999CC',
    'sidebarlinkcolor': '#EBEDE6',
    'relbarbgcolor': '#332E3D',
    'relbartextcolor': '#EBEDE6',
    'relbarlinkcolor': '#EBEDE6',
    'bgcolor': '#EBEDE6',
    'textcolor': '#27232F',
    'linkcolor': '#4052A0', 
    'visitedlinkcolor': '#474290',
    'headbgcolor': '#F5F7F0',
    'headtextcolor': '#27232F',
    'headlinkcolor': '#474290',
    # 'codebgcolor': 'white',
    # 'codetextcolor': 'white',
    # 'bodyfont': 'white',
    # 'headfont': 'white',
}
html_static_path = ['_static']

html_css_files = [
    'css/custom.css',
]

html_show_sourcelink = False

html_favicon = './_static/favicon.ico'